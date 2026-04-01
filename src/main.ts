import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "./app.module";

// Keep a cached instance for serverless performance
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors();
    await app.init();

    cachedServer = expressApp;
  }
  return cachedServer;
}

// Vercel expects a function export for the serverless entry point
export default async (req: any, res: any) => {
  const server = await bootstrap();
  server(req, res);
};
