import { FixedFee, NoWinNoFee } from '../models/fee'

const VALID_SETTLEMENT_THRESHOLD_PCT = 0.1

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

type ValidationResult = { valid: true } | { valid: false; reason: string }

export function isSettlementValid(
  fee: NoWinNoFee,
  settlement: number,
): ValidationResult {
  const lowerBound =
    fee.expectedSettlementAmount -
    VALID_SETTLEMENT_THRESHOLD_PCT * fee.expectedSettlementAmount

  const upperBound =
    fee.expectedSettlementAmount +
    VALID_SETTLEMENT_THRESHOLD_PCT * fee.expectedSettlementAmount

  return settlement >= lowerBound && settlement <= upperBound
    ? { valid: true }
    : {
        valid: false,
        reason: 'settlement is not within valid range of expected settlement',
      }
}
