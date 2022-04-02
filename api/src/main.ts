import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setup } from './setup'

// TODO: mode /jobs to /modules/jobs

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setup(app)

  await app.listen(4000)
}

bootstrap()
