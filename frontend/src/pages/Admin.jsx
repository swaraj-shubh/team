import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/teams")
      .then(res => setTeams(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      {teams.map(t => (
        <div key={t._id}>
          <h4>{t.teamName} - {t.teamId}</h4>
          <p>Status: {t.status}</p>
        </div>
      ))}
    </div>
  );
}
