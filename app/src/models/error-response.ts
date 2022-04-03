// TODO: nice to have this as a class with a tostring method that handles
//       getting the complete messeage when message is undefined or not etc.
export default interface ErrorResponse {
  status: number
  error: string
  message?: string | string[]
}
