import { MiddlewareFn } from "type-graphql";
import { Cookie } from "../cookies.js";
import type { ContextType } from "../../../types/index.js";
import { Request } from "express";
import { ScheduleDatabaseModel } from "../../database/scheduleOperations.js";

export const authenticationMiddleWare: MiddlewareFn<ContextType> = async (
  { context },
  next
) => {
  try {
    const verifiedToken = getVerifiedToken(context.req);

    if (!verifiedToken) return new Error("No auth");

    context.res.locals.user = verifiedToken.id;

    return next();
  } catch (error) {
    throw new Error("No auth");
  }
};

export const authorizeMiddleware: MiddlewareFn<ContextType> = async (
  { context, args },
  next
) => {
  const schedule = await ScheduleDatabaseModel.getScheduleById(args.sid);
  if (!schedule || schedule.authorId !== context.res.locals.user)
    throw new Error("Not authorized");
  return next();
};

export const getUserMiddleware: MiddlewareFn<ContextType> = async (
  { context },
  next
) => {
  const verifiedToken = getVerifiedToken(context.req);
  if (verifiedToken) context.res.locals.user = verifiedToken.id;
  return next();
};

const getVerifiedToken = (req: Request) => {
  try {
    const token: string = req.cookies["accessToken"];
    return Cookie.verifyAccessToken(token);
  } catch (err) {
    if (process.env.ENVINROMENT !== "PRODUCTION") {
      console.log(err);
    } else {
      throw err;
    }
  }
};
