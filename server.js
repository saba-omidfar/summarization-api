
import express from "express";
import summarizeRoute from "./route.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api", summarizeRoute);

app.get("/", (req, res) => {
  res.send("Summarization API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
