import { Module } from '@nestjs/common';
import { AuthenController } from './authen.controller';
import { AuthenService } from './authen.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { RoleUser } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleUser])],
  controllers: [AuthenController],
  providers: [AuthenService],
})
export class AuthenModule {}
