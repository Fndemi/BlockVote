// src/components/pages/VotePanel.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";
import { Container, Card, Form, Button, ListGroup, Alert } from "react-bootstrap";

const VotePanel = () => {
  const [department, setDepartment] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [votingEnd, setVotingEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [error, setError] = useState("");

  const fetchCandidates = async () => {
    if (!department) return setError("Please enter your department first.");

    try {
      setError("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const result = await contract.getCandidates(department);
      setCandidates(result);

      const endTime = await contract.votingEndTime();
      setVotingEnd(Number(endTime));
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching candidates.");
    }
  };

  const handleVote = async (index) => {
    if (voted) return alert("You have already voted!");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.vote(index);
      await tx.wait();

      setVoted(true);
      alert("✅ Vote cast!");
    } catch (err) {
      console.error("Vote error:", err);
      alert("Voting failed.");
    }
  };

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
    <Container className="my-4">
      <Card>
        <Card.Body>
          <h3 className="mb-3 text-primary">🗳 Vote for Your Delegate</h3>

          <Form className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="me-2"
            />
            <Button onClick={fetchCandidates} variant="primary">
              Load Candidates
            </Button>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}

          {timeLeft && (
            <Alert variant="info">
              <strong>Voting ends in:</strong> {timeLeft}
            </Alert>
          )}

          {candidates.length > 0 && (
            <ListGroup>
              {candidates.map((c, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>{c.name}</strong> — {c.voteCount.toString()} vote(s)
                  </span>
                  <Button
                    variant="success"
                    onClick={() => handleVote(idx)}
                    disabled={voted}
                  >
                    Vote
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VotePanel;
