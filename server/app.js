import express, { json } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import errorHandler from "./middlewares/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import linkRouter from "./routes/linkRouter.js";

const app = express();

// Middlewares
app.use(morgan("short"));
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// app.use(helmet());

// Routes
app.use("/api/auth/", authRouter);
app.use("/api/links/", linkRouter);

// Error Handler
app.use(errorHandler);

export default app;
