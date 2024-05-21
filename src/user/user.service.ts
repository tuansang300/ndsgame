import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerOwn } from 'src/entities/server.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ServerOwn)
    private serverRepository: Repository<ServerOwn>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findbyUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username: username });
  }

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async deactive(id: number): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }

  async getServerDomain(username: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username: username });
    return (
      await this.serverRepository.findOne({ where: { OwnUser: user.id } })
    ).IPServer;
  }
}
