import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../constants";

function RegisterVoter() {
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      if (!window.ethereum) {
        return alert("Please install MetaMask");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.registerVoter(department);
      setMessage("Submitting registration...");
      await tx.wait();
      setMessage("Registration successful!");
    } catch (error) {
      console.error(error);
      setMessage("Error during registration.");
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Register as Voter</h2>
      <input
        type="text"
        placeholder="Your Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={handleRegister} className="bg-blue-600 text-white px-4 py-2 rounded">
        Register
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default RegisterVoter;
