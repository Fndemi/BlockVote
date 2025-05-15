// src/components/pages/RegisterVoter.js
import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../constants";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

function RegisterVoter() {
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("info");

  const handleRegister = async () => {
    try {
      if (!window.ethereum) {
        return alert("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setMessage("Submitting registration...");
      setVariant("info");

      const tx = await contract.registerVoter(department);
      await tx.wait();

      setMessage("✅ Registration successful!");
      setVariant("success");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error during registration.");
      setVariant("danger");
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4 text-primary">📝 Register as Voter</h3>

          <Form>
            <Form.Group className="mb-3" controlId="formDept">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" onClick={handleRegister} className="w-100">
              Register
            </Button>
          </Form>

          {message && (
            <Alert className="mt-3" variant={variant}>
              {message}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegisterVoter;
