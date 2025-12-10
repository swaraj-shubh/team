import express from "express";
import Team from "../models/Team.js";

const router = express.Router();

// ✅ Get All Teams (Admin)
router.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find().populate("leader members");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
