/**
 * Site password gate cookie: `<exp>.<hex HMAC-SHA256>`, keyed with the
 * configured gate password, so it cannot be forged without the password and
 * stops verifying when the password changes.
 *
 * Middleware runs on the Edge runtime and is synchronous, so neither Node's
 * `crypto` nor async Web Crypto is available there; SHA-256 is implemented
 * here on plain typed arrays so the same code runs in middleware and routes.
 */

export const GATE_COOKIE = 'bricks_www_gate'
export const GATE_PASSWORD_ENV = 'WWW_SITE_GATE_PASSWORD'
export const GATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

const CONTEXT = 'bricks_www_gate.v1'
const VALUE_RE = /^(\d{1,12})\.([0-9a-f]{64})$/

export function gatePassword(): string {
  return (process.env[GATE_PASSWORD_ENV] || '').trim()
}

function nowSec(): number {
  return Math.floor(Date.now() / 1000)
}

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

function sha256(data: Uint8Array): Uint8Array {
  const bitLen = data.length * 8
  const padded = new Uint8Array(((data.length + 9 + 63) >> 6) << 6)
  padded.set(data)
  padded[data.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000))
  view.setUint32(padded.length - 4, bitLen >>> 0)

  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ])
  const w = new Uint32Array(64)
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))

  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4)
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0
    }
    let [a, b, c, d, e, f, g, hh] = h
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (S0 + maj) >>> 0
      hh = g
      g = f
      f = e
      e = (d + t1) >>> 0
      d = c
      c = b
      b = a
      a = (t1 + t2) >>> 0
    }
    h[0] = (h[0] + a) >>> 0
    h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0
    h[5] = (h[5] + f) >>> 0
    h[6] = (h[6] + g) >>> 0
    h[7] = (h[7] + hh) >>> 0
  }

  const out = new Uint8Array(32)
  const outView = new DataView(out.buffer)
  for (let i = 0; i < 8; i++) outView.setUint32(i * 4, h[i])
  return out
}

function hmacSha256Hex(key: string, message: string): string {
  const enc = new TextEncoder()
  let k: Uint8Array = enc.encode(key)
  if (k.length > 64) k = sha256(k)
  const ipad = new Uint8Array(64)
  const opad = new Uint8Array(64)
  for (let i = 0; i < 64; i++) {
    const b = i < k.length ? k[i] : 0
    ipad[i] = b ^ 0x36
    opad[i] = b ^ 0x5c
  }
  const msg = enc.encode(message)
  const inner = new Uint8Array(64 + msg.length)
  inner.set(ipad)
  inner.set(msg, 64)
  const innerHash = sha256(inner)
  const outer = new Uint8Array(64 + 32)
  outer.set(opad)
  outer.set(innerHash, 64)
  let hex = ''
  for (const b of sha256(outer)) hex += b.toString(16).padStart(2, '0')
  return hex
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function signature(password: string, exp: number): string {
  return hmacSha256Hex(password, `${CONTEXT}.${exp}`)
}

/** Cookie value proving the holder entered `password`; valid for `GATE_COOKIE_MAX_AGE`. */
export function mintGateCookie(password: string, now = nowSec()): string {
  if (!password) throw new Error(`${GATE_PASSWORD_ENV} is not set`)
  const exp = now + GATE_COOKIE_MAX_AGE
  return `${exp}.${signature(password, exp)}`
}

/** True only for an unexpired cookie minted by `mintGateCookie` under this exact password. */
export function verifyGateCookie(
  value: string | undefined,
  password = gatePassword(),
  now = nowSec(),
): boolean {
  if (!password || typeof value !== 'string') return false
  const m = VALUE_RE.exec(value)
  if (!m) return false
  const exp = Number(m[1])
  if (!Number.isSafeInteger(exp) || exp <= now || exp > now + GATE_COOKIE_MAX_AGE) return false
  return constantTimeEqual(m[2], signature(password, exp))
}
