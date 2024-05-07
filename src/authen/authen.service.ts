import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenService {
  signUp(authCredentialsDto: any): Promise<void> {
    throw new Error('Method not implemented.');
  }

  signIn(authCredentialsDto: any): Promise<{ accessToken: string }> {
    throw new Error('Method not implemented.');
  }
}
