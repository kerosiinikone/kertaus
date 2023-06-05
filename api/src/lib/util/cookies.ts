import { User } from "@prisma/client";
import jwt, { verify } from "jsonwebtoken";
import type { Response, CookieOptions } from "express";

export interface AccessTokenPayload {
  id: string;
}

export interface RefreshTokenPayload {
  id: string;
  version: number;
}

export interface VerifiedRefreshToken extends RefreshTokenPayload {
  exp: number;
}

export interface VerifiedAccessToken extends AccessTokenPayload {
  exp: number;
}

export const buildTokens = (user: User) => {
  const refreshTokenPayload: RefreshTokenPayload = {
    id: user.id,
    version: user.tokenVersion,
  };
  const accessTokenPayload: AccessTokenPayload = { id: user.id };

  const accessToken = signAccessToken(accessTokenPayload);
  const refreshToken = signRefreshToken(refreshTokenPayload);

  return { accessToken, refreshToken };
};

const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "15m" });
};

const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: "7d" });
};

const defaultOptions: CookieOptions = {
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

export const verifyRefreshToken = (token: string) => {
  try {
    const payload = verify(
      token,
      process.env.SECRET_TOKEN
    ) as VerifiedRefreshToken;
    return payload;
  } catch (error) {}
};

export const verifyAccessToken = (token: string) => {
  try {
    const payload = verify(
      token,
      process.env.SECRET_TOKEN
    ) as VerifiedAccessToken;
    return payload;
  } catch (error) {}
};

export const setCookies = (access: string, refresh: string, res: Response) => {
  res.cookie("accessToken", access, {
    ...defaultOptions,
    maxAge: 1000 * 60 * 15,
  });
  res.cookie("refreshToken", refresh, {
    ...defaultOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

export const refreshTokens = (token: VerifiedRefreshToken, version: number) => {
  if (token.version !== version) throw "Token revoked";
  const access = signAccessToken({ id: token.id });
  const refresh = signRefreshToken({ id: token.id, version });
  return { access, refresh };
};
