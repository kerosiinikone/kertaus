import dotenv from "dotenv";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import { ApolloServer } from "@apollo/server";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { startPrisma } from "./db.ts";
import { UserResolver } from "./src/models/User/userResolver.ts";
import pkg from "body-parser";
import { AuthResolver } from "./src/models/User/auth/authResolver.ts";
import { ContextType } from "../shared/index.ts";
import { ScheduleResolver } from "./src/models/Schedule/resolver.ts";
import { refreshRouter } from "./src/routes/refresh.ts";
import authenticationMethod from "./src/lib/util/auth/index.ts";

const { json } = pkg;
dotenv.config();

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver, AuthResolver, ScheduleResolver],
  });

  await startPrisma();
  const app = express();
  const httpServer = http.createServer(app);

  const client = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await client.start();

  app.use(cookieParser());
  app.use(
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
  );
  app.use("/refresh", refreshRouter);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(`🚀 Server ready at ${process.env.SERVER_URL}`);
};

await main();
