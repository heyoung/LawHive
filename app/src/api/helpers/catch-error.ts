import ErrorResponse from '../../models/error-response'
import * as E from 'fp-ts/lib/Either'
import axios from 'axios'

export async function sendRequest<T>(
  fn: () => Promise<T>,
): Promise<E.Either<T, ErrorResponse>> {
  try {
    return E.left(await fn())
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return E.right({
        status: error.response?.status ?? -1,
        error: error.name,
        message: error.message,
      })
    }

    if (error instanceof Error) {
      return E.right({ status: -1, error: error.name, message: error.message })
    }

    return E.right({
      status: -1,
      error: 'Request failed. Unknown error',
    })
  }
}
