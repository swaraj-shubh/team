import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [teamName, setTeamName] = useState("");
  const [captcha, setCaptcha] = useState(null);
const navigate = useNavigate();

useEffect(() => {
  const user = localStorage.getItem("user");
  if (!user) navigate("/auth");
}, []);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  console.log("Stored User:", storedUser); // Debugging line
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);

    setLeader((prev) => ({
      ...prev,
      name: parsedUser.name || "",
      email: parsedUser.email || "",
    }));
  }
}, []);

  const [leader, setLeader] = useState({
    name: "",
    email: "",
    phone: "",
    usn: ""
  });

  const [members, setMembers] = useState([
    { name: "", email: "", phone: "", usn: "" }
  ]);

  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Add new member field
const addMember = () => {
  if (members.length >= 4) {
    alert("⚠️ Maximum 4 team members allowed");
    return;
  }

  setMembers([...members, { name: "", email: "", phone: "", usn: "" }]);
};

  // ✅ Handle member input change
  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  // ✅ Handle submit
  const submitTeam = async () => {
    if (!captcha) return alert("Please complete CAPTCHA");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("teamName", teamName);
      formData.append("leader", JSON.stringify(leader));
      formData.append("members", JSON.stringify(members));
      formData.append("captchaToken", captcha);

      for (let i = 0; i < idCards.length; i++) {
        formData.append("idCards", idCards[i]);
      }

      await axios.post(
        "http://localhost:5000/api/teams/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Team Registered Successfully");

      setTeamName("");
      setLeader({ name: "", email: "", phone: "", usn: "" });
      setMembers([{ name: "", email: "", phone: "", usn: "" }]);
      setIdCards([]);
      setCaptcha(null);

    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-slate-900 rounded-2xl shadow-xl p-6 space-y-6 border border-slate-800">

        <h2 className="text-2xl font-bold text-center text-white">
          🚀 Team Registration
        </h2>

        {/* ✅ Team Name */}
        <input
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />

        {/* ✅ Leader Section */}
        <div className="border border-slate-700 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-sky-400">👑 Team Leader</h3>

          <input
            className="input-style"
            placeholder="Leader Name"
            value={leader.name}
            onChange={(e) => setLeader({ ...leader, name: e.target.value })}
          />

          <input
            className="input-style"
            placeholder="Leader Email"
            value={leader.email}
            onChange={(e) => setLeader({ ...leader, email: e.target.value })}
          />

          <input
            className="input-style"
            placeholder="Leader Phone"
            onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
          />

          <input
            className="input-style"
            placeholder="Leader USN"
            onChange={(e) => setLeader({ ...leader, usn: e.target.value })}
          />
        </div>

        {/* ✅ Members Section */}
        <div className="border border-slate-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-400">👥 Team Members</h3>
            <button
              onClick={addMember}
              className="bg-slate-800 px-3 py-1 rounded-md text-sm hover:bg-slate-700"
            >
              ➕ Add Member
            </button>
          </div>

          {members.map((m, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input className="input-style" placeholder="Name"
                onChange={(e) => handleMemberChange(i, "name", e.target.value)} />

              <input className="input-style" placeholder="Email"
                onChange={(e) => handleMemberChange(i, "email", e.target.value)} />

              <input className="input-style" placeholder="Phone"
                onChange={(e) => handleMemberChange(i, "phone", e.target.value)} />

              <input className="input-style" placeholder="USN"
                onChange={(e) => handleMemberChange(i, "usn", e.target.value)} />
            </div>
          ))}
        </div>

        {/* ✅ Upload */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-purple-400">🪪 Upload ID Cards</h3>
          <input
            type="file"
            multiple
            className="text-white"
            onChange={(e) => setIdCards(e.target.files)}
          />
        </div>

        {/* ✅ CAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6LcuhicsAAAAADfoRQZVK00LCKrGk5cCX4ssX4-4"
            onChange={setCaptcha}
          />
        </div>

        {/* ✅ Submit */}
        <button
          onClick={submitTeam}
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 p-3 rounded-lg text-white font-bold transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Register Team"}
        </button>

      </div>

      {/* ✅ Small reusable style */}
      <style>{`
        .input-style {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: #1e293b;
          color: white;
          border: 1px solid #334155;
          outline: none;
        }
        .input-style:focus {
          border-color: #38bdf8;
          box-shadow: 0 0 0 2px rgba(56,189,248,0.3);
        }
      `}</style>
    </div>
  );
}
