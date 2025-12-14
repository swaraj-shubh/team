// import mongoose from "mongoose";

// const teamSchema = new mongoose.Schema(
//   {
//     teamName: { type: String, required: true },
//     teamId: { type: String, required: true, unique: true }, // e.g. TEAM-XYZ123

//     leader: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Participant",
//       required: true,
//     },

//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Participant",
//       },
//     ],

//     idCardUrls: [String], // URLs or paths of uploaded ID cards

//     status: {
//       type: String,
//       enum: ["pending", "verified", "rejected"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// export const Team = mongoose.model("Team", teamSchema);



import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String, 
    required: true,
    unique: true
  },
  teamId: {
    type: String, 
    required: true, 
    unique: true
  },
  leader: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: "Participant" 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Participant"
  }],
  status: { 
    type: String, 
    enum: ["pending", "verified", "rejected"],
    default: "pending" 
  },
});

export default mongoose.model("Team", teamSchema);
