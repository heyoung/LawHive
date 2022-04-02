import { INestApplication, ValidationPipe } from '@nestjs/common'

export function setup(app: INestApplication) {
  app.enableVersioning()
  app.useGlobalPipes(new ValidationPipe())
}
