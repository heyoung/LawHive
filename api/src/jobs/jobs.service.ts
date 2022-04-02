import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Job, JobDocument } from 'src/models/job'
import { Model } from 'mongoose'

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}

  create(job: Job): Promise<Job> {
    return new this.jobModel(job).save()
  }

  getAll(): Promise<Job[]> {
    return this.jobModel.find().exec()
  }
}
