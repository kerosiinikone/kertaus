import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "./type.ts";
import {
  createUser,
  getAllUsers,
  getUserByParam,
} from "../../lib/database/userOperations.ts";
import { comparePasswords, hashPassword } from "../../lib/util/crypt.ts";
import { validate } from "email-validator";

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users() {
    return await getAllUsers({});
  }
}

@Resolver(User)
export class AuthResolver {
  @Mutation(() => User)

  // MIDDLEWARE -> If logged in, Protect
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const userExists = await getUserByParam({ email });

    if (userExists) throw Error("User already exists!");

    if (!validate(email)) throw Error("Bad input!");

    const hashedPassword = await hashPassword(password);

    // COOKIES

    return await createUser({ email, password: hashedPassword });
  }

  @Mutation(() => User)

  // MIDDLEWARE -> If logged in, Protect
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    const user = await getUserByParam({ email });

    if (!user) throw Error("User doesn't exists!");

    if (!(await comparePasswords(password, user.password)))
      throw Error("Wrong credentials!");

    // COOKIES

    return user;
  }
}
