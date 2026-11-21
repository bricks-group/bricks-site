/**
 * Supplier details shown before pay and in the written copy (Ontario Consumer
 * Protection Act, 2002, O. Reg. 17/05 s. 32-33). The legal name comes from
 * legal-config.ts (owner's name until the business name is registered).
 */
import { legalPartyName, legalPartyLine, TRADING_NAME } from '@/lib/legal-config'

export const SUPPLIER = {
  legalName: legalPartyName(),
  legalPartyLine: legalPartyLine(),
  tradeName: TRADING_NAME,
  address: '6330 Montevideo Road, Mississauga, ON L5N 3V2, Canada',
  phone: '(289) 312-7425',
  email: 'help@brxs.ca',
  gstHst: '798370003 RT0001',
} as const
