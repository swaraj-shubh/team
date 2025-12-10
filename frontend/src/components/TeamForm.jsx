"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/axios";

// shadcn ui components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TeamForm() {
  const [teamName, setTeamName] = useState("");

  const [leader, setLeader] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
  });

  const [leaderExists, setLeaderExists] = useState({
    email: false,
    phone: false,
    usn: false,
  });

  const [members, setMembers] = useState([
    { name: "", email: "", phone: "", usn: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  // ✅ Debounced Live Check Function
  const useDebouncedCheck = (value, field) => {
    useEffect(() => {
      if (!value) {
        setLeaderExists((prev) => ({ ...prev, [field]: false }));
        return;
      }

      const timer = setTimeout(async () => {
        try {
          const params = new URLSearchParams();
          params.append(field, value);

          const { data } = await api.get(
            `/participants/check?${params.toString()}`
          );

          setLeaderExists((prev) => ({ ...prev, [field]: data.exists }));
        } catch (err) {
          console.error("Duplicate check failed:", err);
        }
      }, 500);

      return () => clearTimeout(timer);
    }, [value]);
  };

  // ✅ Live checks for Leader
  useDebouncedCheck(leader.email, "email");
  useDebouncedCheck(leader.phone, "phone");
  useDebouncedCheck(leader.usn, "usn");

  // ✅ Handle Member Input Change
  const onMemberChange = (index, field, value) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // ✅ Add New Member Field
  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      { name: "", email: "", phone: "", usn: "" },
    ]);
  };

  // ✅ Final Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");

    if (leaderExists.email || leaderExists.phone || leaderExists.usn) {
      setServerMsg("❌ Leader is already registered.");
      return;
    }

    try {
      setLoading(true);

      // TODO: replace with real reCAPTCHA token
      const recaptchaToken = "dummy-token";

      const payload = {
        teamName,
        leader,
        members,
        recaptchaToken,
        idCardUrls: [],
      };

      const { data } = await api.post("/teams/register", payload);

      setServerMsg(`✅ ${data.message} | Team ID: ${data.teamId}`);

      // ✅ Reset Form After Success
      setTeamName("");
      setLeader({ name: "", email: "", phone: "", usn: "" });
      setMembers([{ name: "", email: "", phone: "", usn: "" }]);
      setLeaderExists({ email: false, phone: false, usn: false });
    } catch (err) {
      console.error(err);
      setServerMsg(
        err.response?.data?.message || "❌ Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl bg-slate-900 border-slate-800 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Team Registration
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ---------------- TEAM NAME ---------------- */}
          <div>
            <Label>Team Name</Label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>

          {/* ---------------- LEADER ---------------- */}
          <div className="border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg">Team Leader</h3>

            <div>
              <Label>Name</Label>
              <Input
                value={leader.name}
                onChange={(e) =>
                  setLeader((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={leader.email}
                onChange={(e) =>
                  setLeader((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              {leader.email && (
                <p
                  className={`text-sm mt-1 ${
                    leaderExists.email ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {leaderExists.email
                    ? "❌ Email already registered"
                    : "✅ Email available"}
                </p>
              )}
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                value={leader.phone}
                onChange={(e) =>
                  setLeader((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
              {leader.phone && (
                <p
                  className={`text-sm mt-1 ${
                    leaderExists.phone ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {leaderExists.phone
                    ? "❌ Phone already registered"
                    : "✅ Phone available"}
                </p>
              )}
            </div>

            <div>
              <Label>USN</Label>
              <Input
                value={leader.usn}
                onChange={(e) =>
                  setLeader((prev) => ({ ...prev, usn: e.target.value }))
                }
                required
              />
              {leader.usn && (
                <p
                  className={`text-sm mt-1 ${
                    leaderExists.usn ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {leaderExists.usn
                    ? "❌ USN already registered"
                    : "✅ USN available"}
                </p>
              )}
            </div>
          </div>

          {/* ---------------- MEMBERS ---------------- */}
          <div className="border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex justify-between items-center">
              Team Members
              <Button type="button" variant="outline" onClick={addMember}>
                + Add Member
              </Button>
            </h3>

            {members.map((member, idx) => (
              <div
                key={idx}
                className="grid md:grid-cols-4 gap-3 border border-slate-800 rounded-md p-3"
              >
                <div>
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) =>
                      onMemberChange(idx, "name", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      onMemberChange(idx, "email", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={member.phone}
                    onChange={(e) =>
                      onMemberChange(idx, "phone", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label>USN</Label>
                  <Input
                    value={member.usn}
                    onChange={(e) =>
                      onMemberChange(idx, "usn", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- SUBMIT ---------------- */}
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Team"}
          </Button>

          {serverMsg && (
            <p className="text-sm mt-2 text-sky-300 whitespace-pre-wrap">
              {serverMsg}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
