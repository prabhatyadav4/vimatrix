// backend/src/app.js

// ── All imports at the top ────────────────────────────────────────────────────
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ApiError } from "./utils/ApiError.js";

// ── Route imports ─────────────────────────────────────────────────────────────
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: CORS — absolute first middleware
// Browser sends OPTIONS preflight before every cross-origin request
// If CORS headers are missing on that preflight → request is blocked
// ─────────────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Security headers (Helmet)
// Must come after CORS so Helmet doesn't override CORS headers
// ─────────────────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    // crossOriginResourcePolicy allows Cloudinary images/videos to load
    // Without this → images from Cloudinary get blocked by browser
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: Rate limiting
// ─────────────────────────────────────────────────────────────────────────────

// General limiter: 1000 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use("/api/", limiter);

// Auth limiter: 10 attempts per 15 minutes (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
  },
});
app.use("/api/v1/users/login", authLimiter);
app.use("/api/v1/users/register", authLimiter);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4: Body parsers and cookie parser
// Must come before routes so req.body is available in controllers
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5: Request logger
// After body parsers so morgan can log body size if needed
// Only in development — too noisy in production
// ─────────────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  // Debug: verify CORS_ORIGIN is loaded correctly
  // Remove this after confirming CORS works
  console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6: Manual NoSQL injection sanitizer
// Replaces express-mongo-sanitize which breaks on Node.js v17+
// Sanitizes req.body and req.params by removing $ and . prefixed keys
// ─────────────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    });
  };

  // Only sanitize body and params — both are writable objects
  // DO NOT touch req.query — read-only getter in Node.js v22
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7: Routes
// ─────────────────────────────────────────────────────────────────────────────
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter); // Issue 6 fix: /playlist not /playlists
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8: 404 handler — catches any route not matched above
// ─────────────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 9: Global error handler
// MUST be last — Express identifies error handlers by 4 parameters (err, req, res, next)
// All errors thrown anywhere in the app land here via next(err)
// ─────────────────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key (e.g. username/email already taken)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists.`;
  }

  // Mongoose validation error (schema validation failed)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again.";
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File size too large. Maximum allowed is 100MB.";
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    // Stack trace only in development — never expose in production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Issue 5 fix: named export to match import { app } in index.js
export { app };
