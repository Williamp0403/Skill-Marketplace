import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index.js";
import webhookRouter from "./routes/webhook.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
const allowedOrigins = [
  process.env.CLIENT_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Normalizar origin quitando barra final si existe
      const normalizedOrigin = origin?.replace(/\/$/, "");

      if (!origin || allowedOrigins.includes(normalizedOrigin!)) {
        callback(null, true);
      } else {
        console.error(`CORS bloqueado para el origen: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ⚠️ Webhook va ANTES de express.json() porque necesita el body crudo (raw)
app.use("/api/webhooks", webhookRouter);

app.use(express.json());

app.use("/api", router);

// Solo escuchar si no estamos en Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`),
  );
}

export default app;
