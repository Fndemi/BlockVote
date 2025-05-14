import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const ResultsPanel = () => {
  const [department, setDepartment] = useState("");
  const [results, setResults] = useState([]);

  const fetchResults = async () => {
    if (!department) return alert("Enter department");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const candidates = await contract.getCandidates(department);

      // Sort by vote count in ascending order
      const sorted = [...candidates].sort((a, b) => {
        return a.voteCount - b.voteCount;
      });

      setResults(sorted);
    } catch (err) {
      console.error("Fetch results error:", err);
      alert("Failed to fetch results.");
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid gray", borderRadius: "8px" }}>
      <h2>📊 Results by Department</h2>

      <input
        type="text"
        placeholder="Enter department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={fetchResults}>View Results</button>

      {results.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {results.map((c, idx) => (
            <li key={idx}>
              {c.name} — {c.voteCount.toString()} vote(s)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResultsPanel;
