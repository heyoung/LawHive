import { IsIn, IsNotEmpty, IsPositive } from 'class-validator'

export type Payment = { status: 'paid'; amount: number } | { status: 'unpaid' }

// TODO: writting these DTOs seems a bit verbose/duplication. (see also fee.ts)
//       Can we have the validation directly on the models instead
export class BasePaymentDto {
  @IsIn(['paid', 'unpaid'])
  status: 'paid' | 'upaid'
}

export class PaidPaymentDto {
  status: 'paid'

  @IsNotEmpty()
  @IsPositive()
  amount: number
}

export class UnpaidPaymentDto {
  status: 'unpaid'
}
