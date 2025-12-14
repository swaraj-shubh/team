import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [teamName, setTeamName] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API;

  // -------------------------------
  // CLOUDINARY UPLOAD FUNCTION
  // -------------------------------
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

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

  // -------------------------------
  // FORM VALIDATION
  // -------------------------------
  const validateForm = () => {
    const errors = {};

    if (!teamName.trim()) errors.teamName = "Team name is required";
    if (!captcha) errors.captcha = "Please complete CAPTCHA";

    // Leader validation
    if (!leader.name.trim()) errors.leaderName = "Leader name is required";
    if (!leader.email.trim()) errors.leaderEmail = "Leader email is required";
    if (!leader.phone.trim()) errors.leaderPhone = "Leader phone is required";
    if (!leader.usn.trim()) errors.leaderUsn = "Leader USN is required";
    if (!leader.idCardFile) errors.leaderId = "Leader ID card is required";

    // Members validation
    members.forEach((member, index) => {
      if (!member.name.trim()) errors[`memberName${index}`] = `Member ${index + 1} name is required`;
      if (!member.email.trim()) errors[`memberEmail${index}`] = `Member ${index + 1} email is required`;
      if (!member.phone.trim()) errors[`memberPhone${index}`] = `Member ${index + 1} phone is required`;
      if (!member.usn.trim()) errors[`memberUsn${index}`] = `Member ${index + 1} USN is required`;
      if (!member.idCardFile) errors[`memberId${index}`] = `Member ${index + 1} ID card is required`;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------
  // SUBMIT TEAM
  // -------------------------------
  const submitTeam = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    if (!captcha) {
      alert("Please complete CAPTCHA");
      return;
    }

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

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-800/50 text-center">
          <div className="p-4 bg-emerald-500/10 rounded-full inline-flex mb-6">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Team Already Registered</h2>
          <p className="text-slate-400 mb-8">A team is already registered with your email.</p>

          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 p-4 rounded-xl text-white font-bold transition-all duration-300"
          >
            View My Team
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-3">
            🚀 Team Registration
          </h1>
          <p className="text-slate-400">Fill all fields to register your team for Numerano</p>
        </div>

        <form onSubmit={submitTeam} className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-800/50">
          {/* Registration Form Container */}
          {/* <div> */}
            {/* Team Name Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-sky-500/10 rounded-lg">
                  <span className="text-xl">🏷️</span>
                </div>
                <h2 className="text-xl font-bold text-white">Team Information</h2>
              </div>
              
              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
                {formErrors.teamName && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.teamName}</p>
                )}
              </div>
            </div>

            {/* Leader Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <span className="text-xl">👑</span>
                </div>
                <h2 className="text-xl font-bold text-white">Team Leader Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-slate-300 mb-2 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                    placeholder="Leader's full name"
                    value={leader.name}
                    onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                    required
                  />
                  {formErrors.leaderName && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.leaderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                    placeholder="Leader's email"
                    value={leader.email}
                    onChange={(e) => setLeader({ ...leader, email: e.target.value })}
                    required
                  />
                  {formErrors.leaderEmail && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.leaderEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                    placeholder="Leader's phone number"
                    value={leader.phone}
                    onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
                    required
                  />
                  {formErrors.leaderPhone && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.leaderPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 font-medium">
                    USN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                    placeholder="Leader's USN"
                    value={leader.usn}
                    onChange={(e) => setLeader({ ...leader, usn: e.target.value })}
                    required
                  />
                  {formErrors.leaderUsn && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.leaderUsn}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-2 font-medium">
                  ID Card Upload <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 transition-all"
                    onChange={(e) => setLeader({ ...leader, idCardFile: e.target.files[0] })}
                    required
                  />
                  {formErrors.leaderId && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.leaderId}</p>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-2">Upload a clear image of your college ID card</p>
              </div>
            </div>

            {/* Members Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/10 rounded-lg">
                    <span className="text-xl">👥</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Team Members</h2>
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                  <span>+ Add Member</span>
                </button>
              </div>

              <div className="text-slate-400 text-sm mb-6">
                Maximum {4 - members.length} member(s) can be added ({members.length}/4)
              </div>

              <div className="space-y-8">
                {members.map((member, index) => (
                  <div key={index} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-sky-500/10 rounded-lg">
                        <span className="text-lg">👤</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">Member {index + 1}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                          placeholder="Member's full name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                          required
                        />
                        {formErrors[`memberName${index}`] && (
                          <p className="text-red-400 text-sm mt-1">{formErrors[`memberName${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                          placeholder="Member's email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                          required
                        />
                        {formErrors[`memberEmail${index}`] && (
                          <p className="text-red-400 text-sm mt-1">{formErrors[`memberEmail${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                          placeholder="Member's phone number"
                          value={member.phone}
                          onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                          required
                        />
                        {formErrors[`memberPhone${index}`] && (
                          <p className="text-red-400 text-sm mt-1">{formErrors[`memberPhone${index}`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-slate-300 mb-2 font-medium">
                          USN <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                          placeholder="Member's USN"
                          value={member.usn}
                          onChange={(e) => handleMemberChange(index, "usn", e.target.value)}
                          required
                        />
                        {formErrors[`memberUsn${index}`] && (
                          <p className="text-red-400 text-sm mt-1">{formErrors[`memberUsn${index}`]}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-2 font-medium">
                        ID Card Upload <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 transition-all"
                        onChange={(e) => handleMemberFile(index, e.target.files[0])}
                        required
                      />
                      {formErrors[`memberId${index}`] && (
                        <p className="text-red-400 text-sm mt-1">{formErrors[`memberId${index}`]}</p>
                      )}
                      <p className="text-slate-500 text-sm mt-2">Upload a clear image of college ID card</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAPTCHA Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <span className="text-xl">🛡️</span>
                </div>
                <h2 className="text-xl font-bold text-white">Security Verification</h2>
              </div>
              
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={setCaptcha}
                />
              </div>
              {formErrors.captcha && (
                <p className="text-red-400 text-sm mt-2 text-center">{formErrors.captcha}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed p-4 rounded-xl text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing Registration...
                </>
              ) : (
                <>
                  <span>🚀 Register Team</span>
                </>
              )}
            </button>

            {/* Form Note */}
            <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="flex items-start gap-3">
                <span className="text-yellow-400 text-lg">ℹ️</span>
                <div>
                  <h4 className="font-medium text-white mb-1">Important Notes</h4>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>• All fields marked with <span className="text-red-500">*</span> are required</li>
                    <li>• Maximum team size is 5 members (including leader)</li>
                    <li>• ID cards must be clear and readable</li>
                    <li>• Registration cannot be modified after submission</li>
                  </ul>
                </div>
              </div>
            </div>
          {/* </div> */}

        </form>
      </div>
    </div>
  );
}