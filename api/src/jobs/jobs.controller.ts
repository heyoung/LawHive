import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { CreateJobDto, Job, UpdateJobDto } from '../models/job'
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

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() parameters: UpdateJobDto,
  ): Promise<Job> {
    return this.jobsService.update(id, parameters)
  }
}
