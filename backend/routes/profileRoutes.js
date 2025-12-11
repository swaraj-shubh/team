import express from "express";
import Participant from "../models/Participant.js";
import Team from "../models/Team.js";

const router = express.Router();

// ✅ GET TEAM DETAILS BY LOGGED-IN USER EMAIL
router.get("/my-team", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) return res.status(400).json({ msg: "Email is required" });

    // 1️⃣ Check if user exists
    const participant = await Participant.findOne({ email });

    if (!participant) {
      return res.json({ hasTeam: false });
    }

    // 2️⃣ Check if user has a team
    const team = await Team.findOne({ _id: participant.team })
      .populate("leader")
      .populate("members");

    if (!team) {
      return res.json({ hasTeam: false });
    }

    res.json({
      hasTeam: true,
      team,
    });

  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
