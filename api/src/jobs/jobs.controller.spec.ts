import { Test, TestingModule } from '@nestjs/testing'
import { Job } from '../models/job'
import { JobsController } from './jobs.controller'
import { JobsService } from './jobs.service'

const TestJobs: Job[] = [
  {
    title: 'test - title',
    description: 'test description',
    state: 'started',
  },
]

const TestCreatedJob = {
  title: 'created job',
  description: 'created job description',
  state: 'started',
  _id: 'test id',
}

describe('Jobs controller', () => {
  let controller: JobsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(TestJobs),
            create: jest.fn().mockResolvedValue(TestCreatedJob),
          },
        },
      ],
    }).compile()

    controller = module.get<JobsController>(JobsController)
  })

  describe('getAll', () => {
    it('should return array of all jobs', async () => {
      const result = await controller.getAll()
      expect(result).toEqual(TestJobs)
    })
  })

  describe('add', () => {
    it('should return added job', async () => {
      const result = await controller.add({ title: '', description: '' })
      expect(result).toEqual(TestCreatedJob)
    })
  })
})
