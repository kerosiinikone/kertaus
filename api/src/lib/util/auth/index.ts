import { MiddlewareFn } from "type-graphql";
import { verifyAccessToken } from "../cookies.ts";
import { ContextType } from "../../../../../shared";
import { Request } from "express";
import { ScheduleModel } from "../../database/scheduleOperations.ts";

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
  const schedule = await ScheduleModel.getScheduleById(args.sid);
  if (!schedule || schedule.authorId !== context.res.locals.user)
    throw Error("Not authorized");
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
  const token: string = req.cookies["accessToken"];
  return verifyAccessToken(token);
};
