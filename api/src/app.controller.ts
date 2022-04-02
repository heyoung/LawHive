import { Controller, Get } from '@nestjs/common'
import mongoose from 'mongoose'

const Foo = mongoose.model(
  'Foo',
  new mongoose.Schema({
    name: String,
  }),
)

@Controller()
export class AppController {
  @Get()
  getHello() {
    // __MONGO_URI__ is set during e2e testing
    // const mongoUri =
    //   (global as any).__MONGO_URI__ || 'mongodb://root:root@localhost:27017/'
    // mongoose.connect(mongoUri)
    // return {
    //   message: this.appService.getHello(),
    // }
  }
}
