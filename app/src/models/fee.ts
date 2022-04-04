export interface NoWinNoFee {
  type: 'no-win-no-fee'
  feePct: number
  expectedSettlementAmount: number
}

export interface FixedFee {
  type: 'fixed-fee'
  fee: number
}

export type Fee = FixedFee | NoWinNoFee
