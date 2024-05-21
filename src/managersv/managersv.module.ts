import { Module } from '@nestjs/common';
import { ManagersvController } from './managersv.controller';
import { ManagersvService } from './managersv.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerOwn } from 'src/entities/server.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServerOwn, User])],
  controllers: [ManagersvController],
  providers: [ManagersvService],
})
export class ManagersvModule {}
