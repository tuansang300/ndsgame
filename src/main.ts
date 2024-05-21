import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors();
  app.use(cookieParser());
  await app.listen(3001);

  // const proxy = createProxyMiddleware({
  //   target: 'http://localhost:3000',
  //   ws: true,
  // });
  // app.use('/websocket', proxy);
  // app.listen(8080, () => console.log('Proxy server is running on port 8080'));
}
bootstrap();
