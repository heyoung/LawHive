export default interface OkResponse<T> {
  data: T
  status: number
  statusText: string
}
