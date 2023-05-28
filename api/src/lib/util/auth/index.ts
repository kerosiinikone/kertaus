import { MiddlewareFn } from "type-graphql";
import { verifyAccessToken } from "../cookies.ts";
import { ContextType } from "../../../../../shared";

const authenticationMethod: MiddlewareFn<ContextType> = async (
  { context },
  next
) => {
  try {
    const token: string = context.req.cookies["accessToken"];
    const verifiedToken = verifyAccessToken(token);

    if (!verifiedToken) return new Error("No auth");

    context.res.locals.user = verifiedToken.id;

    return next();
  } catch (error) {
    throw new Error("No auth");
  }
};

export default authenticationMethod;
