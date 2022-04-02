import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JobsModule } from './jobs/jobs.module'

@Module({
  imports: [
    // TODO: push the connection user + pwd to be in config. Do we need to set the user up in docker compose too?
    MongooseModule.forRoot(
      (global as any).__MONGO_URI__ ?? 'mongodb://root:root@localhost:27017/',
    ),
    JobsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
