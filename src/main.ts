import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import * as fs from 'fs'; // Import the 'fs' module

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  console.log(`Server running on https://localhost:${process.env.PORT}`);
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
