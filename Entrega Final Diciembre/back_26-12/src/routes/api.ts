import express from "express";
import { userInfoController } from "../controllers/userInfoController";

const router = express.Router();

router.get("/user-info", userInfoController);

export default router;
