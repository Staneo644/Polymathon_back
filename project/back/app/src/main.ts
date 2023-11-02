import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as cors from 'cors';

console.log(
  `Application created, connecting to database ${process.env.DATABASEIP}`,
);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(Reflector);
  app.use(express.json({ limit: '5mb' }));
  const corsOptions = {
    origin: '*',
  };

  app.enableCors(corsOptions);
  app.use(cors(corsOptions));

  await app.init();
  await app.listen(3000);
}

bootstrap();
