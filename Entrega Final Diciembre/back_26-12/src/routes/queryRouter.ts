import express, { Application, Router } from "express";

import { repoSearchController } from "../controllers/repoSearchController";
import { repoInfoController } from "../controllers/repoInfoController";
import { userInfoController } from "../controllers/userInfoController";
import { queryController } from "../controllers/queryController";
import { queryIdController } from "../controllers/queryIdController";
import { queryDeleteController } from "../controllers/queryDeleteController";
import { userDetailsController } from "../controllers/userDetailsController";
import {repoDetailsController} from "../controllers/repoDetailsController";
const router = express.Router();
//Importamos los controladores que se utilizarán para manejar las solicitudes en las diferentes rutas.
router.get("/repos", repoSearchController);
router.post("/repo-info", repoInfoController);
router.post("/users-info", userInfoController);
router.get("/users-details", userDetailsController);
router.post("/repo-details", repoDetailsController);
router.get("/queries", queryController);
router.get("/queries/:id", queryIdController);
router.delete("/queries/:id", queryDeleteController);

export default router;
