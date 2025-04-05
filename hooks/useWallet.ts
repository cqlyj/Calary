"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await ethProvider.send("eth_requestAccounts", []);
      const account = accounts[0];

      const signer = await ethProvider.getSigner();

      setProvider(ethProvider);
      setWalletAddress(account);
      setSigner(signer);

      console.log("Connected:", account);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setProvider(null);
    setSigner(null);
  };

  // Auto-connect if already connected
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connectWallet(); // Auto-connect on refresh
          }
        });
    }
  }, []);

  return {
    walletAddress,
    connectWallet,
    disconnectWallet,
    provider,
    signer,
  };
}
