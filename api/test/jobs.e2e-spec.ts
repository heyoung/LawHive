import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { setup } from '../src/setup'
import mongoose from 'mongoose'
import { CreateJobDto, Job } from '../src/models/job'

describe('JobsController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    setup(app)

    await app.init()
  })

  it('/jobs (GET)', async () => {
    // Assemble
    const server = app.getHttpServer()

    const createdJob: Job = (
      await request(server)
        .post('/v1/jobs')
        .send({
          title: 'title',
          description: 'description',
          fee: { type: 'fixed-fee', fee: 10 },
        })
    ).body

    // Act
    const resp = await request(server).get('/v1/jobs')

    // Assert
    expect(resp.ok).toBe(true)
    // Note: the response body _could_ have more than one job in it depending on the test execution order
    expect(resp.body).toEqual([createdJob])
  })

  it('/v1/jobs (POST) returns created job', async () => {
    const body: CreateJobDto = {
      title: 'title',
      description: 'description',
      fee: { type: 'fixed-fee', fee: 10 },
    }
    const resp = await request(app.getHttpServer())
      .post('/v1/jobs')
      .send(body)
      .expect(201)

    // Assert
    expect(resp.body).toMatchObject({
      ...body,
      state: 'started',
      payment: { status: 'unpaid' },
    })
    expect(mongoose.isValidObjectId(resp.body._id)).toBe(true)
  })

  test.each([
    { foo: 'bar' },
    { title: 'name', description: 'desc' },
    { title: 'title', description: 'description', fee: { type: 'fixed-fee' } },
    {
      title: 'title',
      description: 'description',
      fee: { type: 'no-win-no-fee' },
    },
    {
      title: 'title',
      description: 'description',
      fee: { type: 'random-type' },
    },
  ])(
    '/v1/jobs (POST) %j returns error response when body is invalid',
    async (body) => {
      const resp = await request(app.getHttpServer())
        .post('/v1/jobs')
        .send(body)

      expect(resp.ok).toBe(false)
      expect(resp.statusCode).toBe(400)
      expect(resp.body).toHaveProperty('error')
      expect(resp.body).toHaveProperty('message')
      expect(resp.body).toHaveProperty('statusCode')
    },
  )

  test('/v1/jobs/{:id} (PUT) updates job and returns updated job when job exists', async () => {
    // Assemble
    const body: CreateJobDto = {
      title: 'put test job',
      description: 'description',
      fee: { type: 'fixed-fee', fee: 100 },
    }

    const createdJob = (
      await request(app.getHttpServer()).post('/v1/jobs').send(body)
    ).body

    const update = {
      ...createdJob,
      payment: { status: 'paid', amount: 180 },
    }

    // Act
    const resp = await request(app.getHttpServer())
      .put(`/v1/jobs/${createdJob._id}`)
      .send(update)

    // Assert
    expect(resp.ok).toBe(true)
    expect(resp.body).toMatchObject(update)
  })

  test.each([
    { status: 'na' },
    { status: 'paid' },
    { status: 'paid', amount: 'hello' },
    { status: 'paid', amount: -10 },
  ])(
    '/v1/jobs/{:id} (PUT) when payment property is invalid (%j) returns error response',
    async (payment) => {
      // Assemble
      const body: CreateJobDto = {
        title: 'put test job',
        description: 'description',
        fee: { type: 'fixed-fee', fee: 100 },
      }

      const createdJob = (
        await request(app.getHttpServer()).post('/v1/jobs').send(body)
      ).body

      const update = {
        ...createdJob,
        payment,
      }

      // Act
      const resp = await request(app.getHttpServer())
        .put(`/v1/jobs/${createdJob._id}`)
        .send(update)

      // Assert
      expect(resp.ok).toBe(false)
      expect(resp.statusCode).toBe(400)
    },
  )

  afterAll(async () => {
    await app.close()
  })
})
