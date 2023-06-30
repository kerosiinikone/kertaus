import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import pkg from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ContextType } from "../shared/index.ts";
import { startPrisma } from "./db.ts";
import { ScheduleResolver } from "./src/models/Schedule/resolver.ts";
import { AuthResolver } from "./src/models/User/auth/authResolver.ts";
import { UserResolver } from "./src/models/User/userResolver.ts";
import { refreshRouter } from "./src/routes/refresh.ts";

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
        origin: [process.env.CLIENT_URL, "http://localhost:3000/me"],
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
  return new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
};

await main();
