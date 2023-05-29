import { validate } from "email-validator";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import type { ContextType } from "../../../../../shared/index.js";
import { createUser, getUserByParam } from "../../../lib/database/userModel.js";
import { authenticationMiddleWare } from "../../../lib/util/auth/index.js";
import { buildTokens, setCookies } from "../../../lib/util/cookies.js";
import { comparePasswords, hashPassword } from "../../../lib/util/crypt.js";
import { User } from "../type.js";
import { AuthInput } from "./type.js";

@Resolver(User)
export class AuthResolver {
  @Mutation(() => User)
  async register(
    @Arg("input") { email, password }: AuthInput,
    @Ctx() { res }: ContextType
  ): Promise<User> {
    try {
      const user = await getUserByParam({ email });

      if (user) throw Error("User already exists!");

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
  @UseMiddleware(authenticationMiddleWare)
  logout(@Ctx() { res }: ContextType): boolean {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return true;
  }
}
