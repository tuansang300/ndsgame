import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class AuthenSignInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}

export class AuthenSignUpDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  phone: string;

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  email: string;
}
