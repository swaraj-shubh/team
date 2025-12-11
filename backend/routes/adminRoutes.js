import express from "express";
import {
  getAllParticipants,
  getAllTeams,
  updateTeamStatus,
  deleteTeam,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/participants", getAllParticipants);
router.get("/teams", getAllTeams);
router.put("/team/status", updateTeamStatus);
router.delete("/team/:id", deleteTeam);

export default router;
