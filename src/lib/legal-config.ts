/**
 * Single source of truth for the contracting party's legal name (Kam, t602u).
 *
 * Until "Bricks Group" is registered under Ontario's Business Names Act, the
 * owner's own legal name is used (trading as Bricks). When it is registered, set
 * BUSINESS_NAME_REGISTERED to true and fill BUSINESS_NAME_BIN: every surface
 * (Terms party block, review-and-pay box, written-copy email, footer, structured
 * data, privacy accountability line) then shows "Bricks Group". Do not hardcode
 * either name anywhere else.
 */
export const LEGAL_PARTY_NAME = 'AJANI SHORTERMERCHANT'
export const REGISTERED_BUSINESS_NAME = 'Bricks Group'
export const TRADING_NAME = 'Bricks'
export const BUSINESS_NAME_REGISTERED = false
/** Business Identification Number / registration number from ServiceOntario. Required to flip the switch. */
export const BUSINESS_NAME_BIN = ''

export function businessNameIsRegistered(registered = BUSINESS_NAME_REGISTERED, bin = BUSINESS_NAME_BIN): boolean {
  return registered === true && bin.trim().length > 0
}

/** Name shown as the legal party. */
export function legalPartyName(registered = BUSINESS_NAME_REGISTERED, bin = BUSINESS_NAME_BIN): string {
  return businessNameIsRegistered(registered, bin) ? REGISTERED_BUSINESS_NAME : LEGAL_PARTY_NAME
}

/** Party line for contracts: owner name plus trading name until registered. */
export function legalPartyLine(registered = BUSINESS_NAME_REGISTERED, bin = BUSINESS_NAME_BIN): string {
  return businessNameIsRegistered(registered, bin)
    ? REGISTERED_BUSINESS_NAME
    : `${LEGAL_PARTY_NAME}, a sole proprietor operating as ${TRADING_NAME}`
}
