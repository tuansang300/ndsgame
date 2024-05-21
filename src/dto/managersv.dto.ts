import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ManagerServerInsertDto {
  @IsString()
  @MinLength(4)
  ServerName: string;

  @IsString()
  @MinLength(4)
  IPServer: string;

  @IsString()
  @MinLength(2)
  UserDB: string;

  @IsString()
  @MinLength(4)
  PasswordDB: string;
}
