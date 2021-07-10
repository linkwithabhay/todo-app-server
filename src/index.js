import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/users.js";

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/todo", (req, res) => {
  res.status(200).json({ message: "Connected to Server!!" });
});
app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) throw err.message;
  app.listen(PORT, () => {
    console.log("Connected to DB!");
    console.log(`Server running on port: ${PORT}`);
  });
});
mongoose.set("useFindAndModify", false);
