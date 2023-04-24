import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url/url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlController],
})
export class AppModule {}
