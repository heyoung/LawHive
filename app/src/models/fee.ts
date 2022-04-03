export type NoWinNoFee = { type: 'no-win-no-fee'; feePct: number }
export type FixedFee = { type: 'fixed-fee'; fee: number }
export type Fee = FixedFee | NoWinNoFee
