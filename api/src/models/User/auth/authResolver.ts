import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Args,
  Query,
  UseMiddleware,
} from "type-graphql";
import { User } from "../type.js";
import {
  createUser,
  getUserByParam,
} from "../../../lib/database/userOperations.js";
import { comparePasswords, hashPassword } from "../../../lib/util/crypt.js";
import { validate } from "email-validator";
import { buildTokens, setCookies } from "../../../lib/util/cookies.js";
import type { ContextType } from "../../../../../shared/index.js";
import { AuthInput } from "./type.js";
import authenticationMethod from "../../../lib/util/auth/index.js";

@Resolver(User)
export class AuthResolver {
  @Mutation(() => User)
  async register(
    @Arg("input") { email, password }: AuthInput,
    @Ctx() { res }: ContextType
  ): Promise<User> {
    try {
      const userExists = await getUserByParam({ email });

      if (userExists) throw Error("User already exists!");

      if (!validate(email)) throw Error("Bad input!");

      const hashedPassword = await hashPassword(password);

      const newUser = await createUser({ email, password: hashedPassword });

      const { accessToken, refreshToken } = buildTokens(newUser);
      setCookies(accessToken, refreshToken, res);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => User)
  async login(
    @Arg("input") { email, password }: AuthInput,
    @Ctx() { res }: ContextType
  ): Promise<User> {
    const user = await getUserByParam({ email });

    if (!user) throw Error("User doesn't exists!");

    if (!(await comparePasswords(password, user.password)))
      throw Error("Wrong credentials!");

    const { accessToken, refreshToken } = buildTokens(user);
    setCookies(accessToken, refreshToken, res);

    return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authenticationMethod)
  async logout(@Ctx() { res }: ContextType): Promise<boolean> {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return true;
  }
}
