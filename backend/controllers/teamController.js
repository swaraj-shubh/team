// controller/teamController.js
import Team from "../models/Team.js";
import Participant from "../models/Participant.js";
import { sendEmail } from "../utils/sendEmail.js";
import { verifyIdCard } from "../utils/verifyId.js";

export const registerTeam = async (req, res) => {
  try {
    const { teamName, leader, members } = req.body;

    // ---------------------------------------------------
    // Duplicate Check
    // ---------------------------------------------------
    const all = [leader, ...members];

    for (let p of all) {
      const exists = await Participant.findOne({
        $or: [
          { email: p.email },
          { phone: p.phone },
          { usn: p.usn }
        ],
      });

      if (exists) {
        return res.status(400).json({ msg: "Duplicate participant found" });
      }
    }

    // -----------------------------------------------------------
    // AUTO VERIFICATION (ADD THIS BLOCK RIGHT HERE)
    // -----------------------------------------------------------
    let autoStatus = "verified";

    // Leader Verification
    const leaderVerify = await verifyIdCard(
      leader.idCardUrl,
      leader.name
    );

    if (leaderVerify.error) autoStatus = "pending";
    else if (!leaderVerify.success) autoStatus = "rejected";

    // Members Verification
    for (let m of members) {
      const result = await verifyIdCard(m.idCardUrl, m.name);

      if (result.error) autoStatus = "pending";
      else if (!result.success) autoStatus = "rejected";
    }

    // ---------------------------------------------------
    // Create Participants
    // ---------------------------------------------------
    const leaderDoc = await Participant.create(leader);
    const memberDocs = await Participant.insertMany(members);

    // ---------------------------------------------------
    // Create Team
    // ---------------------------------------------------
    const teamId = "TEAM-" + Date.now();

    const team = await Team.create({
      teamName,
      teamId,
      leader: leaderDoc._id,
      members: memberDocs.map((m) => m._id),
      status: autoStatus,   // << 🔥 FINAL STATUS HERE
    });

    leaderDoc.team = team._id;
    await leaderDoc.save();

    // ---------------------------------------------------
    // Email Confirmation
    // ---------------------------------------------------
    await sendEmail(
      leader.email,
      "🎉 Team Registration Successful",
      `
        <h2>Hello ${leader.name},</h2>

        <p>Your team has been successfully registered!</p>

        <h3>📝 Team Details</h3>
        <ul>
          <li><strong>Team Name:</strong> ${teamName}</li>
          <li><strong>Team ID:</strong> ${teamId}</li>
          <li><strong>Status:</strong> ${team.status.toUpperCase()}</li>
        </ul>

        <h3>👑 Leader</h3>
        <ul>
          <li>Name: ${leader.name}</li>
          <li>Email: ${leader.email}</li>
          <li>USN: ${leader.usn}</li>
        </ul>

        <h3>👥 Members</h3>
        ${members.map(m => `
          <p>
            <strong>${m.name}</strong><br/>
            Email: ${m.email}<br/>
            USN: ${m.usn}
          </p>
        `).join("")}

        <hr/>
        <p style="color: gray;">This is an automated confirmation mail.</p>
      `
    );

    res.json(team);

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};
