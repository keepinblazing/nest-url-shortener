import { NestFactory } from '@nestjs/core';
import { AppModule } from './url.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3004, () => {
    console.log(
      `Url-shortener server ready at: http://localhost:${
        process.env.PORT || 3004
      }`,
    );
  });
}

bootstrap();
