import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
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

    fetchTeamData();
  }, [user]);

  const fetchTeamData = () => {
    setRefreshing(true);
    axios
      .get(`${API_URL}/api/profile/my-team?email=${user.email}`)
      .then((res) => {
        setTeamData(res.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  if (!user || loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-800 border-t-sky-500 border-r-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full"></div>
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-slate-300 animate-pulse">Loading Profile...</p>
      </div>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "rejected": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "pending": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified": return "✅";
      case "rejected": return "❌";
      case "pending": return "⏳";
      default: return "❓";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Profile Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Manage your account and team information</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTeamData}
              disabled={refreshing}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card - Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative w-32 h-32 rounded-full border-4 border-slate-800 shadow-2xl overflow-hidden">
                    <img
                      src={`${user.photo}?authuser=0`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-900">
                    <span className="text-lg">👤</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white text-center">{user.name}</h2>
                <p className="text-slate-400 text-center mt-1 break-all">{user.email}</p>
                
                <div className="mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/20 px-6 py-3 rounded-full">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Google Verified
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 rounded-xl border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="p-1.5 bg-sky-500/10 rounded">
                      <span>📋</span>
                    </div>
                    Account Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Full Name</p>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Email Address</p>
                      <p className="text-white font-medium break-all">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Account Type</p>
                      <p className="text-white font-medium">Team {teamData?.hasTeam ? 'Leader' : 'Member'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {teamData?.hasTeam && (
              <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-800/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="p-1.5 bg-purple-500/10 rounded">
                    <span>📊</span>
                  </div>
                  Team Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Members</span>
                    <span className="text-white font-bold text-xl">{teamData.team.members.length + 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Registration Date</span>
                    <span className="text-white font-medium">Recently</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Team Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(teamData.team.status)}`}>
                      {getStatusIcon(teamData.team.status)} {teamData.team.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Section - Right Column */}
          <div className="lg:col-span-2">
            {teamData?.hasTeam ? (
              <div className="space-y-8">
                {/* Team Header */}
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-800/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 rounded-xl">
                        <span className="text-2xl">🛡️</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{teamData.team.teamName}</h2>
                        <p className="text-slate-400">Team ID: <span className="font-mono text-sky-400">{teamData.team.teamId}</span></p>
                      </div>
                    </div>
                    <div className={`px-5 py-2 rounded-full text-sm font-bold ${getStatusColor(teamData.team.status)} border`}>
                      {getStatusIcon(teamData.team.status)} {teamData.team.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Team Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Leader Card */}
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl">
                        <span className="text-xl">👑</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-400">Team Leader</h3>
                        <p className="text-slate-400 text-sm">Lead administrator</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-slate-800/30 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Full Name</p>
                        <p className="text-white font-bold text-lg">{teamData.team.leader.name}</p>
                      </div>
                      <div className="bg-slate-800/30 p-4 rounded-xl">
                        <p className="text-sm text-slate-400 mb-1">Email Address</p>
                        <p className="text-white font-medium break-all">{teamData.team.leader.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Members Card */}
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-sky-500/20">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-xl">
                          <span className="text-xl">👥</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Team Members</h3>
                          <p className="text-slate-400 text-sm">{teamData.team.members.length} members</p>
                        </div>
                      </div>
                      {teamData.team.members.length > 3 && (
                        <button
                          onClick={() => setShowAllMembers(!showAllMembers)}
                          className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm transition-colors"
                        >
                          {showAllMembers ? 'Show Less' : 'Show All'}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {teamData.team.members.slice(0, showAllMembers ? teamData.team.members.length : 3).map((m, index) => (
                        <div key={m._id} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                                  <span className="text-sm">👤</span>
                                </div>
                                <p className="text-white font-medium">{m.name}</p>
                              </div>
                              <p className="text-slate-400 text-sm break-all pl-11">{m.email}</p>
                            </div>
                            <div className="text-xs px-2 py-1 bg-slate-900/50 rounded text-slate-400">
                              Member {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {!showAllMembers && teamData.team.members.length > 3 && (
                        <div className="text-center pt-2">
                          <p className="text-slate-500 text-sm">
                            +{teamData.team.members.length - 3} more members
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-slate-800/50">
                  <h3 className="text-lg font-semibold text-white mb-4">Team Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => navigator.clipboard.writeText(teamData.team.teamId)}
                      className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-white transition-colors flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Team ID
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-white transition-colors flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* No Team - Register Card */
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-800/50 h-full flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-sky-500/10 to-emerald-500/10 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-500/20 to-emerald-500/20 flex items-center justify-center">
                      <span className="text-4xl">🚀</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h3>
                <p className="text-slate-400 mb-8 max-w-md">
                  Join the Numerano community by creating your team. Collaborate with friends, 
                  solve challenging problems, and compete in exciting events.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    <span>Create New Team</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl text-white font-medium transition-colors flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Explore Events
                  </button>
                </div>
                
                <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 max-w-md">
                  <p className="text-slate-400 text-sm">
                    Need help? Contact our support team at{" "}
                    <span className="text-sky-400">support@numerano.com</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-slate-800/30 text-center">
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Profile • {teamData?.hasTeam ? `${teamData.team.teamName} Team` : 'No Team Registered'}
          </p>
        </div>
      </div>
    </div>
  );
}