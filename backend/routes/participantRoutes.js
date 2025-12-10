import express from "express";
import { 
    // checkDuplicateParticipant, 
    checkParticipant 
} from "../controllers/participantController.js";

const router = express.Router();

router.get("/check", checkParticipant);

export default router;
