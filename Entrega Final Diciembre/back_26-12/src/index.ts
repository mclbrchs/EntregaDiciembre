import express, { Application } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import queryRouter from "./routes/queryRouter";
import authRouter from "./routes/authRouter";

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined.");
}
const mongoUri: string = process.env.MONGO_URI;

if (!process.env.PORT) {
  throw new Error("PORT environment variable is not defined.");
}
const port: number = parseInt(process.env.PORT, 10);

const app: Application = express();

mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on("error", (err: Error) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

db.once("open", () => {
  console.log("Connected to MongoDB 🔋");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", queryRouter);
app.use("/api/login", authRouter);

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port 📡 ${port}`);
});
