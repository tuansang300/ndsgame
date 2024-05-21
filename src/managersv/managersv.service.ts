import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerServerInsertDto } from 'src/dto/managersv.dto';
import { ServerOwn } from 'src/entities/server.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManagersvService {
  constructor(
    @InjectRepository(ServerOwn)
    private serverOwnRepository: Repository<ServerOwn>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async insertNewServer(server: ManagerServerInsertDto): Promise<any> {
    const existingServer = await this.serverOwnRepository.findOne({
      where: { ServerName: server.ServerName, IPServer: server.IPServer },
    });
    if (existingServer) {
      throw new HttpException('Server already exists', HttpStatus.BAD_REQUEST);
    }
    let currentdate = new Date();
    let serverAdd = new ServerOwn();
    serverAdd.ServerName = server.ServerName;
    serverAdd.IPServer = server.IPServer;
    serverAdd.setPassword(server.PasswordDB);
    serverAdd.UserDB = server.UserDB;
    serverAdd.TimeBegin = currentdate;
    currentdate.setDate(currentdate.getDate() + 30);
    serverAdd.TimeEnd = currentdate;
    serverAdd.isActive = true;
    serverAdd.OwnUser = 1;
    await this.serverOwnRepository.save(serverAdd);
    return 'Server created successfully';
  }

  async getOwnerServer(username: string): Promise<any> {
    const existUser = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!existUser) {
      throw new HttpException(
        'The account is not exist',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const serverget = await this.serverOwnRepository.findOne({
      where: { OwnUser: existUser.id },
    });
    if (!serverget) {
      throw new HttpException(
        'The account is not owner any Server',
        HttpStatus.NOT_FOUND,
      );
    }
    let jsonServer = {
      ServerName: serverget.ServerName,
      IPServer: serverget.IPServer,
    };
    return jsonServer;
  }
}
