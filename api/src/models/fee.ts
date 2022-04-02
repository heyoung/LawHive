import { IsIn, IsNotEmpty } from 'class-validator'

// TODO: split this file out

type NoWinNoFeeDiscriminator = 'no-win-no-fee'
type FixedFeeDiscriminator = 'fixed-fee'

interface NoWinNoFee {
  type: NoWinNoFeeDiscriminator
  feePct: number
}

interface FixedFee {
  type: FixedFeeDiscriminator
  fee: number
}

export type Fee = NoWinNoFee | FixedFee

export class BaseFeeDto {
  @IsIn(['no-win-no-fee', 'fixed-fee'])
  type: NoWinNoFeeDiscriminator | FixedFeeDiscriminator
}

export class NoWinNoFeeDto extends BaseFeeDto {
  type: NoWinNoFeeDiscriminator

  @IsNotEmpty()
  feePct: number
}

export class FixedFeeDto extends BaseFeeDto {
  type: FixedFeeDiscriminator

  @IsNotEmpty()
  fee: number
}

export type FeeDto = NoWinNoFeeDto | FixedFeeDto
