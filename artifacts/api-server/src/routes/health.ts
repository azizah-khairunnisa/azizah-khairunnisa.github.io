import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/debug-env", (_req, res) => {
  res.json({
    ADMIN_USERNAME_set: !!process.env.ADMIN_USERNAME,
    ADMIN_USERNAME_value: process.env.ADMIN_USERNAME ?? "(not set)",
    ADMIN_PASSWORD_set: !!process.env.ADMIN_PASSWORD,
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    SUPABASE_URL_set: !!process.env.SUPABASE_URL,
    SESSION_SECRET_set: !!process.env.SESSION_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
});

export default router;
