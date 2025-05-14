import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const CandidateList = () => {
  const [department, setDepartment] = useState("");
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = async () => {
    if (!department) {
      alert("Please enter a department name");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const result = await contract.getCandidates(department);
      setCandidates(result);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      alert("Failed to fetch candidates.");
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid gray", borderRadius: "8px" }}>
      <h2>🎓 View Candidates</h2>

      <input
        type="text"
        placeholder="Enter your department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={fetchCandidates}>Fetch Candidates</button>

      {candidates.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {candidates.map((candidate, index) => (
            <li key={index}>
              <strong>{candidate.name}</strong> – Dept: {candidate.department} – Votes:{" "}
              {candidate.voteCount.toString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CandidateList;
