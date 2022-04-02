import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { setup } from '../src/setup'
import mongoose from 'mongoose'
import { Job } from '../src/models/job'

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
        .send({ title: 'get test', description: 'description' })
    ).body

    // Act
    const resp = await request(server).get('/v1/jobs')

    // Assert
    expect(resp.ok).toBe(true)
    // Note: the response body _could_ have more than one job in it depending on the test execution order
    expect(resp.body).toEqual([createdJob])
  })

  it('/v1/jobs (POST) returns created job', async () => {
    const body = { title: 'title', description: 'description' }
    const resp = await request(app.getHttpServer())
      .post('/v1/jobs')
      .send(body)
      .expect(201)

    // Assert
    expect(resp.body).toMatchObject(body)
    expect(resp.body).toHaveProperty('state', 'started')
    expect(mongoose.isValidObjectId(resp.body._id)).toBe(true)
  })

  it('/v1/jobs (POST) returns error response when body is invalid', async () => {
    const body = { foo: 'bar' }
    const resp = await request(app.getHttpServer()).post('/v1/jobs').send(body)

    expect(resp.ok).toBe(false)
    expect(resp.body).toHaveProperty('error')
    expect(resp.body).toHaveProperty('message')
    expect(resp.body).toHaveProperty('statusCode')
  })

  afterAll(async () => {
    await app.close()
  })
})
