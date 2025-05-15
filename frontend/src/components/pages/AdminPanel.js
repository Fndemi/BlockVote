// src/components/pages/AdminPanel.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";
import { Container, Form, Button, Card, Alert, Row, Col } from "react-bootstrap";

const AdminPanel = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidateDept, setCandidateDept] = useState("");
  const [phase, setPhase] = useState(0);
  const [duration, setDuration] = useState(10);
  const [message, setMessage] = useState("");

  const handleAddCandidate = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.addCandidate(candidateName, candidateDept);
      await tx.wait();
      setMessage("✅ Candidate added successfully!");
    } catch (err) {
      console.error("Add candidate error:", err);
      setMessage("❌ Failed to add candidate.");
    }
  };

  const handleChangePhase = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.setPhase(phase, duration);
      await tx.wait();
      setMessage("✅ Phase changed successfully!");
    } catch (err) {
      console.error("Change phase error:", err);
      setMessage("❌ Failed to change phase.");
    }
  };

  return (
    <Container className="my-5" fluid>
      <h2 className="text-center mb-4 text-primary">🛠 Admin Panel</h2>

      {message && (
        <Alert variant={message.includes("✅") ? "success" : "danger"}>
          {message}
        </Alert>
      )}

      <Card className="mb-4 shadow-sm border-0">
        <Card.Body>
          <h4 className="text-secondary">📅 Set Voting Phase</h4>
          <Row className="align-items-center mb-3">
            <Col md={6}>
              <Form.Select
                value={phase}
                onChange={(e) => setPhase(parseInt(e.target.value))}
              >
                <option value={0}>Registering</option>
                <option value={1}>Voting</option>
                <option value={2}>Ended</option>
              </Form.Select>
            </Col>
            {phase === 1 && (
              <Col md={4}>
                <Form.Control
                  type="number"
                  placeholder="Voting duration (minutes)"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </Col>
            )}
            <Col md={2}>
              <Button variant="primary" onClick={handleChangePhase}>
                Change
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h4 className="text-secondary">🧑‍💼 Add Candidate</h4>
          <Form>
            <Row className="align-items-center">
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Candidate Name"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="mb-2"
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="text"
                  placeholder="Department"
                  value={candidateDept}
                  onChange={(e) => setCandidateDept(e.target.value)}
                  className="mb-2"
                />
              </Col>
              <Col md={2}>
                <Button variant="success" onClick={handleAddCandidate}>
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPanel;
