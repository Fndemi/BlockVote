import React from "react";
import AdminPanel from "./components/AdminPanel";
import VoterPanel from "./components/VoterPanel";
import VotePanel from "./components/VotePanel";
import CandidateList from "./components/CandidateList"; // ✅ Add this
import ResultsPanel  from "./components/ResultsPanel";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎓 School Voting DApp</h1>
      <AdminPanel />
      <VoterPanel />
      <VotePanel />
      <CandidateList /> {/* ✅ Add this */}
      <ResultsPanel />
    </div>
  );
}

export default App;
