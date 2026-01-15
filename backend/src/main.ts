import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Middleware CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Préfixe global pour les routes API
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT || 3001);
}
bootstrap();