import { Fee } from './fee'
import { Payment } from './payment'

export default interface Job {
  _id: string
  title: string
  description: string
  state: 'started'
  fee: Fee
  payment: Payment
}
