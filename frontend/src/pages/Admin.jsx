import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [participants, setParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const API_URL = import.meta.env.VITE_API;
  const fetchData = async () => {
    const p = await axios.get(`${API_URL}/api/admin/participants`);
    const t = await axios.get(`${API_URL}/api/admin/teams`);

    setParticipants(p.data);
    setTeams(t.data);
    setLoading(false);
    console.log("Teams:", t.data);
    console.log("Participants:", p.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (teamId, status) => {
    await axios.put(`${API_URL}/api/admin/team/status`, {
      teamId,
      status,
    });
    fetchData();
  };

  const deleteTeam = async (teamId) => {
    if (!confirm("Are you sure? Deleting team also deletes participants.")) return;

    await axios.delete(`${API_URL}/api/admin/team/${teamId}`);
    fetchData();
  };

  const toggleTeamExpansion = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-slate-300">Loading Admin Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            🛡️ Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Manage participants and teams</p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Teams</p>
                  <p className="text-2xl font-bold text-white">{teams.length}</p>
                </div>
                <div className="p-3 bg-sky-500/10 rounded-lg">
                  <span className="text-xl">🚀</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Participants</p>
                  <p className="text-2xl font-bold text-white">{participants.length}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <span className="text-xl">👤</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Teams</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {teams.filter(t => t.status === "pending").length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Verified Teams</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {teams.filter(t => t.status === "verified").length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          {/* Teams Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-sky-500/10 rounded-lg">
                      <span className="text-xl">🚀</span>
                    </div>
                    Registered Teams
                    <span className="text-sm font-normal text-slate-400">({teams.length})</span>
                  </h2>
                  <p className="text-slate-400 mt-1">Click on teams to view members</p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {teams.map((team) => (
                  <div 
                    key={team._id} 
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200"
                  >
                    {/* Team Header - Clickable */}
                    <div 
                      onClick={() => toggleTeamExpansion(team._id)}
                      className="p-4 cursor-pointer hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`transition-transform duration-200 ${expandedTeamId === team._id ? 'rotate-90' : ''}`}>
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-white">{team.teamName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                team.status === "verified" ? "bg-emerald-500/20 text-emerald-400" :
                                team.status === "rejected" ? "bg-red-500/20 text-red-400" :
                                "bg-yellow-500/20 text-yellow-400"
                              }`}>
                                {team.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">ID: {team.teamId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-slate-400">{team.members.length + 1} members</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {expandedTeamId === team._id && (
                      <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                        {/* Team Leader */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-emerald-500/10 rounded">
                              <span className="text-sm">👑</span>
                            </div>
                            <h4 className="text-sm font-semibold text-emerald-400">Team Leader</h4>
                          </div>
                          <div className="flex items-start gap-4">

                            {/* LEFT: Leader Basic Info */}
                            <div className="bg-slate-900/50 p-3 rounded-lg flex-1">
                              <p className="text-white font-medium">{team.leader.name}</p>
                              <p className="text-slate-400 text-sm truncate">{team.leader.email}</p>
                            </div>

                            {/* RIGHT: Leader ID Card */}
                            <div className="mt-1 flex-1">
                              <p className="text-slate-500 uppercase tracking-wider text-xs">ID Card</p>

                              {team.leader.idCardUrl ? (
                                <a
                                  href={team.leader.idCardUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                  View ID Card
                                </a>
                              ) : (
                                <span className="text-slate-500 text-sm">No ID Card Uploaded</span>
                              )}
                            </div>

                          </div>


                        </div>

                        {/* Team Members */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-sky-500/10 rounded">
                              <span className="text-sm">👥</span>
                            </div>
                            <h4 className="text-sm font-semibold text-white">Team Members ({team.members.length})</h4>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {team.members.map((m) => (
                              <div className="flex items-start gap-4">

                                {/* LEFT: Member Basic Info */}
                                <div key={m._id} className="bg-slate-900/50 p-3 rounded-lg flex-1">
                                  <p className="text-white font-medium">{m.name}</p>
                                  <p className="text-slate-400 text-sm truncate">{m.email}</p>
                                </div>

                                {/* RIGHT: ID Card Preview */}
                                <div className="mt-1 flex-1">
                                  <p className="text-slate-500 uppercase tracking-wider text-xs">ID Card</p>

                                  {m.idCardUrl ? (
                                    <a
                                      href={m.idCardUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                      </svg>
                                      View ID Card
                                    </a>
                                  ) : (
                                    <span className="text-slate-500 text-sm">No ID Card Uploaded</span>
                                  )}
                                </div>

                              </div>

                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                          <button
                            onClick={() => updateStatus(team._id, "verified")}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Verify
                          </button>

                          <button
                            onClick={() => updateStatus(team._id, "rejected")}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>

                          <button
                            onClick={() => updateStatus(team._id, "pending")}
                            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                          </button>

                          <button
                            onClick={() => deleteTeam(team._id)}
                            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors flex items-center gap-2 text-sm ml-auto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">Admin Dashboard • {teams.length} teams • {participants.length} participants</p>
        </div>
      </div>
    </div>
  );
}