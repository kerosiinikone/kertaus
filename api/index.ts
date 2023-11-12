import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import pkg from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import type { ContextType } from "./src/types";
import { startPrisma } from "./db.js";
import { ScheduleResolver } from "./src/models/Schedule/resolver.js";
import { AuthResolver } from "./src/models/User/auth/authResolver.js";
import { UserResolver } from "./src/models/User/userResolver.js";
import { refreshRouter } from "./src/routes/refresh.js";

const { json } = pkg;
dotenv.config();

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const client = await buildApollo(httpServer);

  await client.start();
  await startPrisma();

  app
    .use(cookieParser())
    .use(
      "/graphql",
      cors<cors.CorsRequest>({
        credentials: true,
        origin: [process.env.CLIENT_URL],
      }),
      json(),
      expressMiddleware(client, {
        context: async ({ res, req }) => ({
          req,
          res,
        }),
      })
    )
    .use(
      "/refresh",
      cors<cors.CorsRequest>({
        credentials: true,
        origin: [process.env.CLIENT_URL, `${process.env.CLIENT_URL}/me`],
      })
    )
    .use("/refresh", refreshRouter);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );

  if (process.env.ENVIRONMENT === "DEVELOPMENT")
    console.log(`🚀 Server ready at ${process.env.SERVER_URL}`);
};

const buildApollo = async (
  httpServer: http.Server<
    typeof http.IncomingMessage,
    typeof http.ServerResponse
  >
) => {
  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver, ScheduleResolver],
  });

  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];

  if (process.env.ENVIRONMENT == "production") {
    plugins.push(ApolloServerPluginLandingPageDisabled());
  }
  return new ApolloServer<ContextType>({
    schema,
    plugins,
  });
};

await main();
