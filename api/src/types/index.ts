import { Request, Response } from "express";

export interface ContextType {
  res: Response;
  req: Request;
}

export interface LogoutType {
  success: boolean;
}
