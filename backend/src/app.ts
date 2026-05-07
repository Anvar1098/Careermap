import express from "express";
import cors from "cors";
import surveyRoutes from "./routes/surveyRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "CareerMap API running" });
});

app.use("/api/survey", surveyRoutes);

export default app;
