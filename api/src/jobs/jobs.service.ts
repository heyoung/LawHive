import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateJobDto, Job, JobDocument } from '../models/job'
import { Model } from 'mongoose'

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}

  create(dto: CreateJobDto): Promise<Job> {
    return new this.jobModel({ ...dto, state: 'started' }).save()
  }

  getAll(): Promise<Job[]> {
    return this.jobModel.find().exec()
  }
}
