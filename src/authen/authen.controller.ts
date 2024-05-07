import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('authen')
export class AuthenController {
  @Get()
  async getAuthen() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('login')
  async login() {
    return 'login';
  }
}
