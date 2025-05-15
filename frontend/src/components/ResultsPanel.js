import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { Container, Card, Form, Button, ListGroup, Alert } from "react-bootstrap";

const ResultsPanel = () => {
  const [department, setDepartment] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    if (!department) {
      setError("Please enter a department.");
      return;
    }

    try {
      setError("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const candidates = await contract.getCandidates(department);

      const sorted = [...candidates].sort((a, b) => b.voteCount - a.voteCount); // descending order
      setResults(sorted);
    } catch (err) {
      console.error("Fetch results error:", err);
      setError("Failed to fetch results.");
    }
  };

  return (
    <Container className="my-4">
      <Card>
        <Card.Body>
          <h3 className="mb-3">📊 Results by Department</h3>
          <Form className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="me-2"
            />
            <Button variant="success" onClick={fetchResults}>
              View Results
            </Button>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          {results.length > 0 && (
            <ListGroup>
              {results.map((c, idx) => (
                <ListGroup.Item key={idx}>
                  <strong>{c.name}</strong> — {c.voteCount.toString()} vote(s)
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResultsPanel;
