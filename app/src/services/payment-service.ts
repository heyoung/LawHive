import { FixedFee, NoWinNoFee } from '../models/fee'

export function calculatePayment(
  fee: FixedFee | NoWinNoFee,
  settlement?: number,
): number {
  switch (fee.type) {
    case 'fixed-fee':
      return fee.fee
    case 'no-win-no-fee':
      if (settlement === undefined) {
        throw new Error('Settlement must be defined for no-win-no-fee')
      }

      if (fee.feePct < 0) {
        throw new Error('Fee percentage cannot be negative')
      }

      return (fee.feePct / 100) * settlement
    default:
      throw new Error('Unknow fee type')
  }
}
