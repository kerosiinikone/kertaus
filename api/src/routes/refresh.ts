import express, { Request, Response } from "express";
import { getUserByParam } from "../lib/database/userOperations.js";
import { VerifiedRefreshToken, Cookie } from "../lib/util/cookies.js";

export const refreshRouter = express.Router();

refreshRouter.get("/", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    let vToken: VerifiedRefreshToken = Cookie.verifyRefreshToken(refreshToken);
    const userFound = await getUserByParam({ id: vToken.id });

    if (!userFound) throw Error("No auth");

    const cookie = new Cookie(userFound);

    cookie.refreshTokens(vToken, userFound.tokenVersion);
    cookie.setCookies(res);
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  }
  return res.end();
});
