import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summarizeRouter from "./routes/summarize";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS for production
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

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
