import { Module } from '@nestjs/common';
import { EventsGateway } from './socket.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RoleUser } from 'src/entities/role.entity';
import { ServerOwn } from 'src/entities/server.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RoleUser, ServerOwn]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [EventsGateway, UserService],
})
export class EventsModule {}
