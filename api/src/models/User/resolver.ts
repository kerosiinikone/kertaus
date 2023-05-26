import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "./type.ts";
import {
  createUser,
  getAllUsers,
  getUserByParam,
} from "../../lib/database/userOperations.ts";
import { comparePasswords, hashPassword } from "../../lib/util/crypt.ts";
import { validate } from "email-validator";
import { buildTokens, setCookies } from "../../lib/util/cookies.ts";
import { ContextType } from "../../../index.ts";

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
    @Arg("password") password: string,
    @Ctx() context: ContextType
  ): Promise<User> {
    try {
      const userExists = await getUserByParam({ email });

      if (userExists) throw Error("User already exists!");

      if (!validate(email)) throw Error("Bad input!");

      const hashedPassword = await hashPassword(password);

      const newUser = await createUser({ email, password: hashedPassword });

      const { accessToken, refreshToken } = buildTokens(newUser);
      setCookies(accessToken, refreshToken, context.res);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => User)

  // MIDDLEWARE -> If logged in, Protect
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() context: ContextType
  ): Promise<User> {
    const user = await getUserByParam({ email });

    if (!user) throw Error("User doesn't exists!");

    if (!(await comparePasswords(password, user.password)))
      throw Error("Wrong credentials!");

    const { accessToken, refreshToken } = buildTokens(user);
    setCookies(accessToken, refreshToken, context.res);

    return user;
  }
}
