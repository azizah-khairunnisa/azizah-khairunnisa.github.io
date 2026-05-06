import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import router from "./routes";
import { logger } from "./lib/logger";
import { getUploadsDir, isUsingSupabase } from "./lib/storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!isUsingSupabase()) {
  app.use("/api/uploads", express.static(getUploadsDir(), {
    setHeaders(res, _filePath) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("X-Frame-Options", "ALLOWALL");
      res.setHeader("Content-Disposition", "inline");
    },
  }));
}

app.use("/api", router);

export default app;
