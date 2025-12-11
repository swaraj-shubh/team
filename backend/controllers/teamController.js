// import Team from "../models/Team.js";
// import Participant from "../models/Participant.js";
// import axios from "axios";
// import { sendEmail } from "../utils/sendEmail.js";

// export const registerTeam = async (req, res) => {
//   try {
//     const { teamName, captchaToken } = req.body;

//     // ✅ ✅ ✅ FIX: PARSE JSON STRINGS INTO OBJECTS
//     const leader = JSON.parse(req.body.leader);
//     const members = JSON.parse(req.body.members);

//     // ✅ CAPTCHA CHECK (optional)
//     // const captchaRes = await axios.post(
//     //   "https://www.google.com/recaptcha/api/siteverify",
//     //   null,
//     //   {
//     //     params: {
//     //       secret: process.env.RECAPTCHA_SECRET,
//     //       response: captchaToken,
//     //     },
//     //   }
//     // );

//     // if (!captchaRes.data.success)
//     //   return res.status(400).json({ msg: "Captcha Failed" });

//     // ✅ Duplicate Check
//     const allMembers = [leader, ...members];

//     for (let user of allMembers) {
//       const exists = await Participant.findOne({
//         $or: [
//           { email: user.email },
//           { phone: user.phone },
//           { usn: user.usn },
//         ],
//       });

//       if (exists)
//         return res.status(400).json({
//           msg: "Duplicate participant found",
//         });
//     }

//     // ✅ Create Participants
//     const leaderDoc = await Participant.create(leader);
//     const memberDocs = await Participant.insertMany(members);

//     // ✅ Create Team
//     const teamId = "TEAM-" + Date.now();

//     const team = await Team.create({
//       teamName,
//       teamId,
//       leader: leaderDoc._id,
//       members: memberDocs.map((m) => m._id),
//       idCardUrls: req.files.map((f) => f.path),
//       status: "pending",
//     });

//     // ✅ Update leader with team reference
//     leaderDoc.team = team._id;
//     await leaderDoc.save();

//     // ✅ Send email
//     await sendEmail(
//       leader.email,
//       "✅ Team Registered Successfully",
//       `<h2>${teamName}</h2><p>Your Team ID: ${teamId}</p>`
//     );

//     res.json(team);

//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ msg: err.message });
//   }
// };


import Team from "../models/Team.js";
import Participant from "../models/Participant.js";
import { sendEmail } from "../utils/sendEmail.js";

export const registerTeam = async (req, res) => {
  try {
    const { teamName, leader, members } = req.body;

    // leader = { name, email, phone, usn, idCardUrl }
    // members = [ { name, email, phone, usn, idCardUrl }, ... ]

    // ✅ CAPTCHA CHECK (optional)
    // const captchaRes = await axios.post(
    //   "https://www.google.com/recaptcha/api/siteverify",
    //   null,
    //   {
    //     params: {
    //       secret: process.env.RECAPTCHA_SECRET,
    //       response: captchaToken,
    //     },
    //   }
    // );

    // if (!captchaRes.data.success)
    //   return res.status(400).json({ msg: "Captcha Failed" });

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

    // ---------------------------------------------------
    // Create Participants (idCardUrl INCLUDED)
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
      status: "pending",
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
