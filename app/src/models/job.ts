import { Fee } from './fee'

export default interface Job {
  _id: string
  title: string
  description: string
  state: 'started'
  fee: Fee
}
