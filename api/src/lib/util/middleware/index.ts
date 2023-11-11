import { MiddlewareFn } from "type-graphql";
import { Cookie } from "../cookies.ts";
import { ContextType } from "../../../../../shared/index.ts";
import { Request } from "express";
import { ScheduleModel } from "../../database/scheduleOperations.ts";
import lops2019 from "../../../../../lops2019.js";

const BAD_INPUT = "Bad Input Error";

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
    throw new Error("Not authorized");
  return next();
};

export const typeCheckMiddleware: MiddlewareFn<ContextType> = async (
  { args },
  next
) => {
  const { subject } = args;
  if (typeof subject != "string") throw new Error(BAD_INPUT);

  const s = subject.toLowerCase();

  if (
    !lops2019.codes.includes(s) &&
    !lops2019.subjects.includes(s) &&
    !lops2019.courseNames.includes(s)
  )
    throw new Error(BAD_INPUT);

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
  return Cookie.verifyAccessToken(token);
};
