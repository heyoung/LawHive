export default interface ErrorResponse {
  status: number
  error: string
  message?: string | string[]
}
