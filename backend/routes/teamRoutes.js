// backend/routes/teamRoutes.js
import express from "express";
import multer from "multer";
import { registerTeam } from "../controllers/teamController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/register", upload.array("idCards"), registerTeam);

export default router;
