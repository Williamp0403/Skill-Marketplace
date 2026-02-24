import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routes/index.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`),
);
