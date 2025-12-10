import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl p-6 space-y-6 border border-slate-800 text-center">

        <h2 className="text-2xl font-bold text-white">👤 My Profile</h2>

        {/* ✅ Profile Photo */}
        <div className="flex justify-center">
          <img
            src={user.photo}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-sky-500 shadow-lg"
          />
        </div>

        {/* ✅ User Info */}
        <div className="space-y-2 text-white">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>

        {/* ✅ Status Badge */}
        <div className="bg-emerald-500/20 text-emerald-400 py-2 rounded-full text-sm font-semibold">
          ✅ Logged in with Google
        </div>

        {/* ✅ Go to Register */}
        <button
          onClick={() => navigate("/register")}
          className="w-full mt-4 bg-sky-600 hover:bg-sky-700 p-3 rounded-lg text-white font-bold transition"
        >
          🚀 Go to Team Registration
        </button>

      </div>
    </div>
  );
}
