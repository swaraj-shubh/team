import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [teamName, setTeamName] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API;
  // -------------------------------
  // CLOUDINARY UPLOAD FUNCTION
  // -------------------------------
  const uploadToCloudinary = async (file) => {
    if (!file) return null; // prevent crash

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    form.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // -------------------------------
  // AUTH CHECK
  // -------------------------------
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/auth");
  }, []);

  // -------------------------------
  // Leader Object
  // -------------------------------
  const [leader, setLeader] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
    idCardUrl: "",
    idCardFile: null,
  });

  // Autofill name/email
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setLeader((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }));
    }
  }, []);

  // -------------------------------
  // Members
  // -------------------------------
  const [members, setMembers] = useState([
    { name: "", email: "", phone: "", usn: "", idCardUrl: "", idCardFile: null },
  ]);

  const addMember = () => {
    if (members.length >= 4) {
      alert("⚠️ Maximum 4 team members allowed");
      return;
    }

    setMembers([
      ...members,
      { name: "", email: "", phone: "", usn: "", idCardUrl: "", idCardFile: null },
    ]);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleMemberFile = (index, file) => {
    const updated = [...members];
    updated[index].idCardFile = file;
    setMembers(updated);
  };

  // -------------------------------
  // CHECK IF ALREADY REGISTERED
  // -------------------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    axios
      .get(`${API_URL}/api/profile/my-team?email=${parsedUser.email}`)
      .then((res) => {
        if (res.data.hasTeam) {
          setAlreadyRegistered(true);
        }
      })
      .catch(() => {});
  }, []);

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-6 space-y-6 border border-slate-800 text-center">
          <h2 className="text-xl font-bold text-white">✅ You Already Registered</h2>
          <p className="text-slate-300">A team is already registered with your email.</p>

          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-sky-600 hover:bg-sky-700 p-3 rounded-lg text-white font-bold transition"
          >
            View My Team
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------
  // SUBMIT TEAM
  // -------------------------------
  const submitTeam = async () => {
    if (!captcha) return alert("Please complete CAPTCHA");

    try {
      setLoading(true);

      // ⭐ Upload Leader ID
      const leaderIdUrl = await uploadToCloudinary(leader.idCardFile);

      const leaderData = {
        ...leader,
        idCardUrl: leaderIdUrl,
      };

      // ⭐ Upload Member IDs
      const memberData = [];
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const url = await uploadToCloudinary(m.idCardFile);
        memberData.push({ ...m, idCardUrl: url });
      }

      // ⭐ Submit JSON
      await axios.post(`${API_URL}/api/teams/register`, {
        teamName,
        leader: leaderData,
        members: memberData,
        captchaToken: captcha,
      });

      alert("✅ Team Registered Successfully");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-slate-900 rounded-2xl shadow-xl p-6 space-y-6 border border-slate-800">
        <h2 className="text-2xl font-bold text-center text-white">🚀 Team Registration</h2>

        {/* Team Name */}
        <input
          className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />

        {/* Leader Section */}
        <div className="border border-slate-700 rounded-lg p-4 space-y-3">
          <h3 className="text-lg font-semibold text-sky-400">👑 Team Leader</h3>

          <input
            className="input-style"
            placeholder="Leader Name"
            value={leader.name}
            onChange={(e) => setLeader({ ...leader, name: e.target.value })}
            required
          />

          <input
            className="input-style"
            placeholder="Leader Email"
            value={leader.email}
            onChange={(e) => setLeader({ ...leader, email: e.target.value })}
            required
          />

          <input
            className="input-style"
            placeholder="Leader Phone"
            onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
            required
          />

          <input
            className="input-style"
            placeholder="Leader USN"
            onChange={(e) => setLeader({ ...leader, usn: e.target.value })}
            required
          />

          {/* Leader ID Upload */}
          <input
            type="file"
            className="text-white"
            onChange={(e) =>
              setLeader({ ...leader, idCardFile: e.target.files[0] })
            }
            required
          />
        </div>

        {/* Members */}
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
            <div key={i} className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  className="input-style"
                  placeholder="Name"
                  onChange={(e) => handleMemberChange(i, "name", e.target.value)}
                  required
                />

                <input
                  className="input-style"
                  placeholder="Email"
                  onChange={(e) => handleMemberChange(i, "email", e.target.value)}
                  required
                />

                <input
                  className="input-style"
                  placeholder="Phone"
                  onChange={(e) => handleMemberChange(i, "phone", e.target.value)}
                  required
                />

                <input
                  className="input-style"
                  placeholder="USN"
                  onChange={(e) => handleMemberChange(i, "usn", e.target.value)}
                  required
                />
              </div>

              {/* Member ID upload */}
              <input
                type="file"
                className="text-white"
                onChange={(e) => handleMemberFile(i, e.target.files[0])}
                required
              />
            </div>
          ))}
        </div>

        {/* CAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={setCaptcha}
            required
          />
        </div>

        {/* Submit */}
        <button
          onClick={submitTeam}
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 p-3 rounded-lg text-white font-bold transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Register Team"}
        </button>
      </div>

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
