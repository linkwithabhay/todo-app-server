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

app.use("/user", userRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (error) return console.error(error.stack);
  app.listen(PORT, () => {
    console.log("Connected to DB!");
    console.log(`Server running on port: ${PORT}`);
  });
});
mongoose.set("useFindAndModify", false);
