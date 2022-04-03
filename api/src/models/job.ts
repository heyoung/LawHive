import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { IsDefined, IsNotEmpty, ValidateNested } from 'class-validator'
import { Document } from 'mongoose'
import { BaseFeeDto, Fee, FeeDto, FixedFeeDto, NoWinNoFeeDto } from './fee'

// TODO: split this file out?
export type JobDocument = Job & Document

type JobState = 'started'

@Schema()
export class Job {
  @Prop()
  title: string

  @Prop()
  description: string

  @Prop()
  state: JobState

  @Prop({ type: Object })
  fee: Fee
}

export class CreateJobDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string

  @ValidateNested()
  @IsDefined()
  @Type(() => BaseFeeDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: FixedFeeDto, name: 'fixed-fee' },
        { value: NoWinNoFeeDto, name: 'no-win-no-fee' },
      ],
    },
  })
  fee: FeeDto
}

export const JobSchema = SchemaFactory.createForClass(Job)
