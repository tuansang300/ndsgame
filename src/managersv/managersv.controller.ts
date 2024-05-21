import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ManagerServerInsertDto } from 'src/dto/managersv.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ManagersvService } from './managersv.service';
import { Response } from 'express';

@Controller('managersv')
export class ManagersvController {
  constructor(private managersvService: ManagersvService) {}
  @Post('/insert')
  @UseGuards(AuthGuard)
  async signup(
    @Body(ValidationPipe) managerServerInsertDto: ManagerServerInsertDto,
    @Res() res: Response,
  ): Promise<any> {
    var result = await this.managersvService.insertNewServer(
      managerServerInsertDto,
    );
    res.status(HttpStatus.OK).json({ message: result });
  }

  @Get('/owner')
  @UseGuards(AuthGuard)
  async getOwnerServer(@Req() req: any, @Res() res: Response): Promise<any> {
    var result = await this.managersvService.getOwnerServer(req.user.username);
    res.status(HttpStatus.OK).json({ message: result });
  }
}
