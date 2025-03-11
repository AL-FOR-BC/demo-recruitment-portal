import { IsEmail, Length } from "class-validator";

export class UserInput {
  @IsEmail()
  email: string;

  @Length(3, 50)
  fullname: string;

  @Length(6, 100)
  password: string;

  // @Length(3, 24)
  // username: string;
}
export interface AuthPayload {
  id: string;
  email: string;
  verified: boolean;
}
