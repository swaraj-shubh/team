import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API;
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  // ✅ AFTER USER LOADS → Fetch team details
  useEffect(() => {
    if (!user) return;

    axios
      .get(`${API_URL}/api/profile/my-team?email=${user.email}`)
      .then((res) => {
        setTeamData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user || loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mb-4"></div>
        <p className="text-lg font-medium text-slate-300">Loading Profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Profile Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Manage your account and team information</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <div className="lg:w-2/5">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full blur-md opacity-30"></div>
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full border-4 border-slate-800 shadow-2xl object-cover"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-semibold">✓ Logged in with Google</span>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <span className="text-xl">👤</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Account Details</h3>
                  </div>
                  <div className="space-y-3 pl-14">
                    <div>
                      <p className="text-sm text-slate-400">Full Name</p>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Email Address</p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="lg:w-3/5">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 h-full">
              {teamData?.hasTeam ? (
                <div className="h-full flex flex-col">
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-sky-500/10 rounded-lg">
                          <span className="text-2xl">🛡️</span>
                        </div>
                        Team Information
                      </h2>
                      <p className="text-slate-400 mt-1">Your team details and members</p>
                    </div>
                    <div className="px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full">
                      <span className="text-sky-400 font-semibold text-sm">ACTIVE</span>
                    </div>
                  </div>

                  {/* Team Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-800/50 p-5 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-sky-500/10 rounded-lg">
                          <span className="text-xl">🏷️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Team Name</h3>
                      </div>
                      <p className="text-2xl font-bold text-sky-400">{teamData.team.teamName}</p>
                    </div>

                    <div className="bg-slate-800/50 p-5 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-sky-500/10 rounded-lg">
                          <span className="text-xl">🔑</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Team ID</h3>
                      </div>
                      <p className="text-xl font-mono text-white font-bold">{teamData.team.teamId}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mb-8">
                    <div className="bg-slate-800/50 p-5 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Team Status</h3>
                          <p className="text-slate-400">Current registration status</p>
                        </div>

                        {/* Dynamic Status Badge */}
                        {teamData.team.status === "verified" && (
                          <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                            <span className="text-emerald-400 font-bold">Verified</span>
                          </div>
                        )}

                        {teamData.team.status === "rejected" && (
                          <div className="px-5 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                            <span className="text-red-400 font-bold">Rejected</span>
                          </div>
                        )}

                        {teamData.team.status === "pending" && (
                          <div className="px-5 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                            <span className="text-yellow-400 font-bold">Pending</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                  {/* Leader & Members */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Leader Card */}
                    <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-5 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <span className="text-xl">👑</span>
                        </div>
                        <h3 className="text-lg font-semibold text-emerald-400">Team Leader</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-slate-300">Name</p>
                          <p className="text-white font-bold text-lg">{teamData.team.leader.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">Email</p>
                          <p className="text-white font-medium">{teamData.team.leader.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Members Card */}
                    <div className="bg-slate-800/50 p-5 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-sky-500/10 rounded-lg">
                          <span className="text-xl">👥</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Team Members</h3>
                          <p className="text-sm text-slate-400">{teamData.team.members.length} members</p>
                        </div>
                      </div>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {teamData.team.members.map((m) => (
                          <div key={m._id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/30">
                            <p className="text-white font-medium">{m.name}</p>
                            <p className="text-sm text-slate-400 truncate">{m.email}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Team - Register Button */
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
                    <span className="text-4xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Team Yet</h3>
                  <p className="text-slate-400 mb-8 max-w-md">
                    You haven't registered a team yet. Create or join a team to participate in events.
                  </p>
                  <button
                    onClick={() => navigate("/register")}
                    className="group relative px-8 py-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative flex items-center gap-3">
                      Register Your Team
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                  <p className="text-slate-500 text-sm mt-6">
                    Need help? Contact support at support@example.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}