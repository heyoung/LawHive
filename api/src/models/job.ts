import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type JobDocument = Job & Document

@Schema()
export class Job {
  @Prop()
  title: string

  @Prop()
  description: string
}

export const JobSchema = SchemaFactory.createForClass(Job)
