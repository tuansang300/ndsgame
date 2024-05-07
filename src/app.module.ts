import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenModule } from './authen/authen.module';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleUser } from './entities/role.entity';
import { ServerOwn } from './entities/server.entity';
import { ListFeatureServer } from './entities/listfeatureSv.entity';
import { Features } from './entities/feature.entity';
import { LoggerMiddleware } from './middleware/logger';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: '9dgm',
      password: '9lYV5G6Tuz36K04X66CCjtAkY',
      database: 'ndsgame',
      synchronize: true,
      autoLoadEntities: true,
      entities: [User, RoleUser, ServerOwn, ListFeatureServer, Features],
    }),
    AuthenModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
