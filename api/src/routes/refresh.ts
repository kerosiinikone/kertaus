import express, { Request, Response } from "express";
import {
  VerifiedRefreshToken,
  refreshTokens,
  setCookies,
  verifyRefreshToken,
} from "../lib/util/cookies.ts";
import { getUserByParam } from "../lib/database/userOperations.ts";

export const refreshRouter = express.Router();

refreshRouter.get("/", async (req: Request, res: Response) => {
  try {
    const refreshToken: string = req.cookies["refreshToken"];

    console.log(refreshToken);

    let vToken: VerifiedRefreshToken;

    if (refreshToken) vToken = verifyRefreshToken(refreshToken);

    const userFound = await getUserByParam({ id: vToken.id });

    if (!userFound) throw Error("No auth");

    const { access, refresh } = refreshTokens(vToken, userFound.tokenVersion);

    setCookies(access, refresh, res);
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
  return res.end();
});
