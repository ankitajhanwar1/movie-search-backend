import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createIndex } from './elasticsearch/createIndex';
import { config } from 'dotenv';

config();

async function bootstrap() {
  await createIndex(); 
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,  
    methods: 'GET', 
    allowedHeaders: 'Content-Type',
  });
  await app.listen(process.env.PORT);
}
bootstrap();
