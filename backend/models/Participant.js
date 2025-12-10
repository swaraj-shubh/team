// import mongoose from "mongoose";

// const participantSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },

//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     usn: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//     },

//     team: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Team",
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// export const Participant = mongoose.model("Participant", participantSchema);



import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  usn: { type: String, unique: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});

export default mongoose.model("Participant", participantSchema);
