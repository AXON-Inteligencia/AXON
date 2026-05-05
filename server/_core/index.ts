import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import path from "node:path";
import fs from "node:fs";
import { appRouter, verifyToken, type Context } from "../routers.ts";
import { initializeDb } from "../db.ts";
import { createServer as createViteServer } from "vite";

const PORT = parseInt(process.env.PORT || "3000", 10);
const isDev = process.env.NODE_ENV !== "production";

async function main() {
  await initializeDb();

  const app = express();
  app.use(express.json());

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: async ({ req }): Promise<Context> => {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.slice(7);
          const decoded = await verifyToken(token);
          if (decoded) {
            return { userId: decoded.userId };
          }
        }
        return { userId: null };
      },
    })
  );

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(import.meta.dirname, "public");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Self-ping to prevent Render free tier from sleeping
    if (!isDev) {
      const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
      if (RENDER_URL) {
        setInterval(async () => {
          try {
            await fetch(`${RENDER_URL}/api/health`);
          } catch (_) {
            // ignore errors
          }
        }, 4 * 60 * 1000); // every 4 minutes
      }
    }
  });
}

main().catch(console.error);
