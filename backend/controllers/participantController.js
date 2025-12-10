// import { Participant } from "../models/Participant.js";

// export const checkDuplicateParticipant = async (req, res) => {
//   try {
//     const { email, phone, usn } = req.query;

//     const query = {};

//     if (email) query.email = email.toLowerCase().trim();
//     if (phone) query.phone = phone.trim();
//     if (usn) query.usn = usn.toUpperCase().trim();

//     if (Object.keys(query).length === 0) {
//       return res.json({ exists: false });
//     }

//     const existing = await Participant.findOne(query);

//     return res.json({ exists: !!existing });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ exists: false });
//   }
// };




import Participant from "../models/Participant.js";

export const checkParticipant = async (req, res) => {
  const { email, phone, usn } = req.query;

  const existing = await Participant.findOne({
    $or: [{ email }, { phone }, { usn }]
  });

  res.json({ exists: !!existing });
};
