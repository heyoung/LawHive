import ErrorResponse from '../../models/error-response'
import * as E from 'fp-ts/lib/Either'
import axios from 'axios'
import OkResponse from '../../models/ok-response'

// TODO: the error response has json of the same format as ErrorResponse
//       we can parse this to get more detailed error messages vs the axios messages
export async function sendRequest<T>(
  fn: () => Promise<OkResponse<T>>,
): Promise<E.Either<T, ErrorResponse>> {
  try {
    const response = await fn()

    return E.left(response.data)
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
