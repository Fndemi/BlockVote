import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const AdminPanel = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidateDept, setCandidateDept] = useState("");
  const [phase, setPhase] = useState(0);
  const [duration, setDuration] = useState(10); // Default: 10 minutes

  const handleAddCandidate = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.addCandidate(candidateName, candidateDept);
      await tx.wait();
      alert("Candidate added successfully!");
    } catch (err) {
      console.error("Add candidate error:", err);
      alert("Failed to add candidate.");
    }
  };

  const handleChangePhase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Pass both phase and duration (duration only matters when starting Voting phase)
      const tx = await contract.setPhase(phase, duration);
      await tx.wait();
      alert("Phase changed successfully!");
    } catch (err) {
      console.error("Change phase error:", err);
      alert("Failed to change phase.");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid gray", borderRadius: "8px" }}>
      <h2>🛠 Admin Panel</h2>

      <div>
        <h3>Set Voting Phase</h3>
        <select onChange={(e) => setPhase(parseInt(e.target.value))}>
          <option value={0}>Registering</option>
          <option value={1}>Voting</option>
          <option value={2}>Ended</option>
        </select>
        {phase === 1 && (
          <input
            type="number"
            placeholder="Voting duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            style={{ marginLeft: "1rem" }}
          />
        )}
        <button onClick={handleChangePhase}>Change Phase</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h3>Add Candidate</h3>
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Department"
          value={candidateDept}
          onChange={(e) => setCandidateDept(e.target.value)}
        />
        <button onClick={handleAddCandidate}>Add</button>
      </div>
    </div>
  );
};

export default AdminPanel;
