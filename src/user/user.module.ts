import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { RoleUser } from 'src/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleUser])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
