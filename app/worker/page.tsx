"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

const EmployeePage: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [percentages, setPercentages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Hardcoded contract address and ABI
  const contractAddress = "0xYourContractAddress"; // Replace with your contract address
  const contractABI = [
    // Add the ABI of your contract here
    {
      type: "function",
      name: "getEmployeeId",
      inputs: [
        {
          name: "walletAddress",
          type: "address",
        },
      ],
      outputs: [
        {
          name: "employeeId",
          type: "uint256",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "setPreferences",
      inputs: [
        {
          name: "employeeId",
          type: "uint256",
        },
        {
          name: "tokens",
          type: "address[]",
        },
        {
          name: "percentages",
          type: "uint256[]",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "claimPayroll",
      inputs: [
        {
          name: "employeeId",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
    },
  ];

  // Fetch employeeId by wallet address
  const getEmployeeId = async () => {
    if (!walletAddress || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const id = await contract.getEmployeeId(walletAddress);
      setEmployeeId(Number(id));
    } catch (err) {
      console.error("Error fetching employee ID:", err);
    } finally {
      setLoading(false);
    }
  };

  // Set employee preferences (tokens and percentages)
  const setEmployeePreferences = async () => {
    if (
      !employeeId ||
      !selectedTokens.length ||
      !percentages.length ||
      !window.ethereum
    )
      return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      await contract.setPreferences(employeeId, selectedTokens, percentages);
      console.log("Preferences set successfully");
    } catch (err) {
      console.error("Error setting preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  // Claim payroll
  const claimEmployeePayroll = async () => {
    if (!employeeId || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      await contract.claimPayroll(employeeId);
      console.log("Payroll claimed successfully");
    } catch (err) {
      console.error("Error claiming payroll:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 text-black p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          👨‍💻 Employee Dashboard
        </h1>

        {/* Wallet address input & Employee ID fetch */}
        <div className="bg-gray-100 p-6 rounded-xl mb-8 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Get Your Employee ID
          </h2>
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="p-4 w-full mb-4 border-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={getEmployeeId}
            disabled={!walletAddress || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              walletAddress && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Fetching ID..." : "Get Employee ID"}
          </button>
          {employeeId !== null && (
            <div className="mt-4 text-xl font-semibold text-center text-blue-600">
              Your Employee ID: {employeeId}
            </div>
          )}
        </div>

        {/* Set Preferences */}
        <div className="bg-gray-100 p-6 rounded-xl mb-8 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Set Preferences
          </h2>
          <div className="flex flex-col space-y-4 mb-6">
            <input
              type="text"
              placeholder="Enter token address"
              onChange={(e) => setSelectedTokens([e.target.value])}
              className="p-4 w-full border-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Enter percentage"
              onChange={(e) => setPercentages([parseInt(e.target.value)])}
              className="p-4 w-full border-2 rounded-lg border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={setEmployeePreferences}
            disabled={
              !employeeId ||
              !selectedTokens.length ||
              !percentages.length ||
              loading
            }
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              selectedTokens.length && percentages.length && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Setting Preferences..." : "Set Preferences"}
          </button>
        </div>

        {/* Claim Payroll */}
        <div className="bg-gray-100 p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Claim Payroll
          </h2>
          <button
            onClick={claimEmployeePayroll}
            disabled={!employeeId || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Claiming..." : "Claim Payroll"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
