import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { Container, Form, Button, Alert, ListGroup, Card, Row, Col } from "react-bootstrap";

const CandidateList = () => {
  const [department, setDepartment] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState("");

  const fetchCandidates = async () => {
    if (!department) {
      setError("Please enter a department name.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const result = await contract.getCandidates(department);
      setCandidates(result);
      setError("");
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError("❌ Failed to fetch candidates.");
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <h3 className="mb-4">🎓 View Candidates</h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Row className="align-items-center mb-3">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Enter your department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button variant="primary" onClick={fetchCandidates}>
                Fetch Candidates
              </Button>
            </Col>
          </Row>

          {candidates.length > 0 && (
            <>
              <h5>🗳️ Candidates in {department} Department</h5>
              <ListGroup className="mt-3">
                {candidates.map((candidate, index) => (
                  <ListGroup.Item key={index}>
                    <strong>{candidate.name}</strong> — Dept: <em>{candidate.department}</em> — Votes:{" "}
                    {candidate.voteCount.toString()}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CandidateList;
