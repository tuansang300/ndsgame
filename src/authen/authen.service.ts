import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenSignInDto } from 'src/dto/authen.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import exp from 'constants';

@Injectable()
export class AuthenService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDto: any): Promise<string> {
    const existingUsername = await this.userRepository.findOne({
      where: { username: authCredentialsDto.username },
    });
    const existingUseremail = await this.userRepository.findOne({
      where: { email: authCredentialsDto.email },
    });
    if (existingUsername) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else if (existingUseremail) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    let user = new User();
    user.setPassword(authCredentialsDto.password);
    user.username = authCredentialsDto.username;
    user.email = authCredentialsDto.email;
    user.firstname = authCredentialsDto.firstname;
    user.lastname = authCredentialsDto.lastname;
    user.phone = authCredentialsDto.phone;
    user.role = 1;
    await this.userRepository.save(user);
    return 'User created successfully';
  }

  async signIn(authSignIn: AuthenSignInDto): Promise<any> {
    try {
      const userexist = await this.userRepository.findOne({
        where: {
          username: authSignIn.username,
          isActive: true,
        },
      });
      if (!userexist) {
        throw new HttpException(
          'The account is not exist',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isPasswordMatch = bcrypt.compareSync(
        authSignIn.password,
        userexist.getPassword(),
      );
      if (!isPasswordMatch) {
        throw new HttpException(
          'The password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = {
        username: userexist.username,
        sub: userexist.id,
      };
      let user = {
        id: userexist.id,
        username: userexist.username,
        role: userexist.role,
        email: userexist.email,
      };
      return {
        user,
        backendTokens: {
          accessToken: await this.jwtService.signAsync(payload, {
            secret: '9dsgame',
            expiresIn: '1h',
          }),
          refreshToken: await this.jwtService.signAsync(payload, {
            secret: '9dsgame',
            expiresIn: '7d',
          }),
          expiresIn: new Date().getTime() + 3600000,
        },
      };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.sub,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '20s',
        secret: process.env.jwtSecretKey,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + 3600000),
    };
  }

  async validateUser(payload: any) {
    const user = await this.userRepository.findOne({
      where: { username: payload.username },
    });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }
}
