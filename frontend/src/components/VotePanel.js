import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const VotePanel = () => {
  const [department, setDepartment] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [votingEnd, setVotingEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const fetchCandidates = async () => {
    if (!department) return alert("Enter department first");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Fetch candidates
      const result = await contract.getCandidates(department);
      setCandidates(result);

      // Fetch voting end time
      const endTime = await contract.votingEndTime();
      setVotingEnd(Number(endTime));
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error fetching candidates");
    }
  };

  const handleVote = async (index) => {
    if (voted) return alert("You already voted");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.vote(index); // No need to pass department
      await tx.wait();

      setVoted(true);
      alert("✅ Vote cast!");
    } catch (err) {
      console.error("Vote error:", err);
      alert("Voting failed");
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (!votingEnd) return;

    const interval = setInterval(() => {
      const secondsLeft = votingEnd - Math.floor(Date.now() / 1000);
      if (secondsLeft <= 0) {
        setTimeLeft("Voting ended");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [votingEnd]);

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid gray", borderRadius: "8px" }}>
      <h2>🗳 Vote for Your Delegate</h2>

      <input
        type="text"
        placeholder="Enter department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <button onClick={fetchCandidates}>Load Candidates</button>

      {timeLeft && (
        <p style={{ marginTop: "1rem" }}>
          <strong>Voting ends in:</strong> {timeLeft}
        </p>
      )}

      {candidates.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {candidates.map((c, idx) => (
            <li key={idx} style={{ marginBottom: "0.5rem" }}>
              {c.name} — Votes: {c.voteCount.toString()}
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => handleVote(idx)}
                disabled={voted}
              >
                Vote
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VotePanel;
