import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

const VoterPanel = () => {
  const [department, setDepartment] = useState("");
  const [registered, setRegistered] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);

  useEffect(() => {
    checkRegistration();
    getCurrentPhase();
  }, []);

  const checkRegistration = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const studentDept = await contract.studentDepartment(userAddress);

      if (studentDept && studentDept !== "") {
        setRegistered(true);
        setDepartment(studentDept);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    }
  };

  const getCurrentPhase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const phase = await contract.currentPhase();
      setCurrentPhase(Number(phase));
    } catch (err) {
      console.error("Error fetching phase:", err);
    }
  };

  const registerVoter = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerVoter(department);
      await tx.wait();

      alert("Voter registered successfully!");
      setRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
      alert("Voter registration failed.");
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid teal", borderRadius: "8px" }}>
      <h2>🗳️ Voter Panel</h2>

      <p><strong>Current Phase:</strong> {
        currentPhase === 0 ? "Registering" :
        currentPhase === 1 ? "Voting" :
        currentPhase === 2 ? "Ended" : "Unknown"
      }</p>

      {!registered ? (
        <>
          <input
            type="text"
            placeholder="Enter Your Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <button onClick={registerVoter}>Register</button>
        </>
      ) : (
        <p>✅ You are registered under <strong>{department}</strong> department.</p>
      )}
    </div>
  );
};

export default VoterPanel;
