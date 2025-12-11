import Team from "../models/Team.js";
import Participant from "../models/Participant.js";

/* -------------------- GET ALL PARTICIPANTS -------------------- */
export const getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find().populate("team");
    res.json(participants);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* -------------------- GET ALL TEAMS -------------------- */
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leader")
      .populate("members");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* -------------------- UPDATE TEAM STATUS -------------------- */
export const updateTeamStatus = async (req, res) => {
  try {
    const { teamId, status } = req.body;

    const team = await Team.findByIdAndUpdate(teamId, { status }, { new: true })
      .populate("leader")
      .populate("members");

    res.json({ msg: "Status updated", team });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* -------------------- DELETE TEAM -------------------- */
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Delete related participants
    await Participant.deleteMany({ team: id });

    // 2️⃣ Delete the team
    await Team.findByIdAndDelete(id);

    res.json({ msg: "Team & related participants deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
