import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summarizeRouter from "../routes/summarize";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use("/api", summarizeRouter);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});
app.get("/", (req, res) => res.send("Backend is running!"));

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
