import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateJobDto, Job } from 'src/models/job'
import { JobsService } from './jobs.service'

@Controller({ path: 'jobs', version: '1' })
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  getAll(): Promise<Job[]> {
    return this.jobsService.getAll()
  }

  @Post()
  add(@Body() parameters: CreateJobDto): Promise<Job> {
    return this.jobsService.create(parameters)
  }
}