import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index.js";
import webhookRouter from "./routes/webhook.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean,
) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (ej: Postman, webhooks)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

// ⚠️ Webhook va ANTES de express.json() porque necesita el body crudo (raw)
app.use("/api/webhooks", webhookRouter);

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`),
);
