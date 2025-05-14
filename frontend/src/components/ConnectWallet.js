// src/components/ConnectWallet.js
import { useState } from "react";

function ConnectWallet({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        onConnect(accounts[0]);
      } catch (err) {
        console.error("User rejected the request");
      }
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  return (
    <div>
      <button onClick={connectWallet} className="bg-blue-500 text-white px-4 py-2 rounded">
        Connect Wallet
      </button>
      {walletAddress && <p className="mt-2">Connected: {walletAddress}</p>}
    </div>
  );
}

export default ConnectWallet;
