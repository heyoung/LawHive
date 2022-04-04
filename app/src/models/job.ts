import { Fee, FixedFee, NoWinNoFee } from './fee'
import { Payment } from './payment'

export default interface Job {
  _id: string
  title: string
  description: string
  state: 'started' | 'paid'
  fee: Fee
  payment: Payment
}

export function isNoWinNoFeeJob(job: Job): job is Job & { fee: NoWinNoFee } {
  return job.fee.type === 'no-win-no-fee'
}

export function isFixedFeeJob(job: Job): job is Job & { fee: FixedFee } {
  return job.fee.type === 'fixed-fee'
}
