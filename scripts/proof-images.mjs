import sharp from 'sharp'
import fs from 'node:fs'
const dir = 'public/media/proof'
const files = ['HDR Before','HDR After','Sky Before','Sky After','Twilight before','twilight After']
let before=0, after=0
for (const f of files) {
  const src = `${dir}/${f}.png`
  before += fs.statSync(src).size
  const slug = f.toLowerCase().replace(/\s+/g, '-')
  for (const w of [704, 1408]) {
    const base = sharp(src).resize({ width: w })
    await base.clone().avif({ quality: 62, effort: 6 }).toFile(`${dir}/${slug}-${w}.avif`)
    await base.clone().webp({ quality: 82, effort: 6 }).toFile(`${dir}/${slug}-${w}.webp`)
    for (const e of ['avif','webp']) { const s=fs.statSync(`${dir}/${slug}-${w}.${e}`).size; console.log(slug,w,e,Math.round(s/1024)+'KB') }
  }
}
console.log('png total', Math.round(before/1024)+'KB')
