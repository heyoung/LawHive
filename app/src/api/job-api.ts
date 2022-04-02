import Job from '../models/job'
import ErrorResponse from '../models/error-response'
import axios from 'axios'
import * as E from 'fp-ts/lib/Either'
import { sendRequest } from './helpers/catch-error'

export function getAllJobs(): Promise<E.Either<Job[], ErrorResponse>> {
  return sendRequest<Job[]>(() => axios.get('/v1/jobs'))
}

export function createJob(
  dto: Pick<Job, 'title' | 'description'>,
): Promise<E.Either<Job, ErrorResponse>> {
  return sendRequest<Job>(() => axios.post('/v1/jobs', dto))
}
