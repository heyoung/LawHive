export type Fee =
  | { type: 'no-win-no-fee'; feePct: number }
  | { type: 'fixed-fee'; fee: number }