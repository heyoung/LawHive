import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateJobDto, Job, JobDocument, UpdateJobDto } from '../models/job'
import { Model } from 'mongoose'

// TODO: handle mongo failures; return result type
@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
  ) {}

  create(dto: CreateJobDto): Promise<Job> {
    return new this.jobModel({
      ...dto,
      state: 'started',
      payment: { status: 'unpaid' },
    }).save()
  }

  update(id: string, dto: UpdateJobDto): Promise<Job> {
    // TODO: handle if not found
    // TODO: implement some form of locking (optimistic locking etc). Can ignore for now as we have 1 user.
    return this.jobModel
      .findByIdAndUpdate(
        id,
        { ...dto, state: dto.payment.status === 'paid' ? 'paid' : undefined },
        { new: true },
      )
      .exec()
  }

  getAll(): Promise<Job[]> {
    return this.jobModel.find().exec()
  }
}
