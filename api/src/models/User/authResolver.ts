import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { User } from "./type.js";
import {
  createUser,
  getUserByParam,
} from "../../lib/database/userOperations.js";
import { comparePasswords, hashPassword } from "../../lib/util/crypt.js";
import { validate } from "email-validator";
import { buildTokens, setCookies } from "../../lib/util/cookies.js";
import type { ContextType } from "../../../../shared/index.js";

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
