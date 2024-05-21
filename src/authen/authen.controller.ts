import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenSignInDto, AuthenSignUpDto } from 'src/dto/authen.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthenService } from './authen.service';
import { Response } from 'express';
import { RefreshGuard } from 'src/guard/refresh.guard';

@Controller('authen')
export class AuthenController {
  constructor(private authService: AuthenService) {}
  @Post('/signin')
  async signin(
    @Body(ValidationPipe) authenSignInDto: AuthenSignInDto,
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.authService.signIn(authenSignInDto);
    res.status(HttpStatus.OK).json(result);
  }

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) authensignupDto: AuthenSignUpDto,
    @Res() res: Response,
  ): Promise<any> {
    var result = await this.authService.signUp(authensignupDto);
    res.status(HttpStatus.OK).json({ message: result });
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async getUser(@Res() res: Response, @Req() req: any): Promise<any> {
    console.log(req.user);
    res.status(HttpStatus.OK).json({ message: 'Hello' });
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}
