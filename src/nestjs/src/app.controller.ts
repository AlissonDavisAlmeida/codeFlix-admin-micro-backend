import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Category } from 'micro-videos-core/dist/category/domain/entities/Category';
console.log('🚀 ~ file: app.controller.ts:4 ~ Category', Category);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
