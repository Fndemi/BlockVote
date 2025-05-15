// src/components/pages/VoterPanel.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const VoterPanel = () => {
  const [department, setDepartment] = useState("");
  const [registered, setRegistered] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [error, setError] = useState("");

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
      setError("Failed to check registration status.");
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
      setError("Failed to fetch current phase.");
    }
  };

  const registerVoter = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerVoter(department);
      await tx.wait();

      alert("✅ Voter registered successfully!");
      setRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
      alert("❌ Voter registration failed.");
    }
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 0:
        return "📝 Registering";
      case 1:
        return "🗳️ Voting";
      case 2:
        return "✅ Ended";
      default:
        return "❓ Unknown";
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <h3 className="mb-3 text-primary">🗳️ Voter Panel</h3>

          <p>
            <strong>Current Phase:</strong> {getPhaseLabel()}
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          {!registered ? (
            <>
              <Form className="d-flex mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter Your Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="me-2"
                />
                <Button variant="primary" onClick={registerVoter}>
                  Register
                </Button>
              </Form>
            </>
          ) : (
            <Alert variant="success">
              ✅ You are registered under <strong>{department}</strong> department.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VoterPanel;
