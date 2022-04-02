import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IsNotEmpty } from 'class-validator'
import { Document } from 'mongoose'

// TODO: split this file out?
export type JobDocument = Job & Document

@Schema()
export class Job {
  @Prop()
  title: string

  @Prop()
  description: string
}

export class CreateJobDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  description: string
}

export const JobSchema = SchemaFactory.createForClass(Job)
