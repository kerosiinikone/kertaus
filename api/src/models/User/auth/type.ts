import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class AuthInput {
  @Field()
  @Length(5, 40)
  @IsEmail()
  email: string;

  @Field()
  @Length(5, 30)
  password: string;
}
