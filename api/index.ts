import type { Request, Response } from "express";
import { createApp } from "../server/app";

let cachedApp: any = null;
let initPromise: Promise<any> | null = null;

async function getApp() {
  if (cachedApp) {
    return cachedApp;
  }
  
  if (!initPromise) {
    initPromise = createApp()
      .then((app) => {
        cachedApp = app;
        return app;
      })
      .catch((err) => {
        console.error("Failed to initialize serverless Express app:", err);
        initPromise = null; // allow retry on next invocation
        throw err;
      });
  }
  
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error: any) {
    console.error("Serverless API execution error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: process.env.NODE_ENV !== "production" ? error?.message : undefined
    });
  }
}
