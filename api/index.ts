import { app, configureApp } from "../server/index";
import type { IncomingMessage, ServerResponse } from "node:http";

configureApp();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req as any, res as any);
}
