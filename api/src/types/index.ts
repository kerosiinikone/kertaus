import { Request, Response } from "express";

export type ContextType = {
  res: Response;
  req: Request;
};

export type LogoutType = {
  success: boolean;
};
