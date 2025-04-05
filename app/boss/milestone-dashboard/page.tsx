"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

const DashboardPage: React.FC = () => {
  const [selectedToken] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState<number | string>("");
  const [employeeWallet, setEmployeeWallet] = useState<string>("");
  const [salaryAmount, setSalaryAmount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Add Employee Handler (Milestone-based)
  const handleAddEmployee = async () => {
    if (!employeeId || !employeeWallet || !salaryAmount || !selectedToken) {
      console.error("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0xB1Ccfc014e8e692FB0a4a63514f75eCc5cb0E24B"; // Replace with actual deployed payroll contract address
      const abi = [
        {
          type: "function",
          name: "addEmployee",
          inputs: [
            {
              name: "employeeId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "connectedWallet",
              type: "address",
              internalType: "address",
            },
            {
              name: "salaryAmount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.addEmployee(
        employeeId,
        employeeWallet,
        ethers.parseUnits(salaryAmount, 6) // Assuming USDC has 6 decimals
      );

      await tx.wait();
      console.log("Employee added successfully");
    } catch (error) {
      console.error("Failed to add employee:", error);
    } finally {
      setLoading(false);
    }
  };

  // Deposit Funds Handler
  const handleDepositFunds = async () => {
    if (!amount || !window.ethereum) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0xB1Ccfc014e8e692FB0a4a63514f75eCc5cb0E24B"; // Replace with actual deployed payroll contract address
      const abi = [
        {
          type: "function",
          name: "depositFunds",
          inputs: [
            {
              name: "amountOfUsdc",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "payable",
        },
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.depositFunds(ethers.parseUnits(amount, 6)); // Assuming USDC has 6 decimals

      await tx.wait();
      console.log("Funds deposited successfully");
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw Funds Handler
  const handleWithdrawFunds = async () => {
    if (!amount || !window.ethereum) return;

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0xB1Ccfc014e8e692FB0a4a63514f75eCc5cb0E24B"; // Replace with actual deployed payroll contract address
      const abi = [
        {
          type: "function",
          name: "withdrawFund",
          inputs: [
            {
              name: "amountOfUsdc",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "nonpayable",
        },
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.withdrawFund(ethers.parseUnits(amount, 6)); // Assuming USDC has 6 decimals

      await tx.wait();
      console.log("Funds withdrawn successfully");
    } catch (error) {
      console.error("Withdraw failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-4 text-center text-blue-600">
        Boss Dashboard - Milestone-Based Payroll
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Manage your payroll system using the functions below:
      </p>

      {/* Add Employee Section (Milestone-based) */}
      <div className="mb-12 w-full max-w-xl bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Add Employee
        </h3>
        <p className="text-gray-600 mb-4">
          To add an employee, fill in the details below.
        </p>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Employee ID
          </label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="p-3 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Employee Wallet Address
          </label>
          <input
            type="text"
            value={employeeWallet}
            onChange={(e) => setEmployeeWallet(e.target.value)}
            className="p-3 w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Salary Amount
          </label>
          <input
            type="text"
            value={salaryAmount}
            onChange={(e) => setSalaryAmount(e.target.value)}
            className="p-3 w-full border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleAddEmployee}
          disabled={loading}
          className={`px-6 py-3 text-white rounded-md w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Add Employee"}
        </button>
      </div>

      {/* Deposit Funds Section */}
      <div className="mb-12 w-full max-w-xl bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Deposit Funds
        </h3>
        <p className="text-gray-600 mb-4">
          Deposit USDC into the payroll contract to fund employee salaries.
        </p>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Amount to Deposit
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 w-full border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleDepositFunds}
          disabled={loading}
          className={`px-6 py-3 text-white rounded-md w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Deposit Funds"}
        </button>
      </div>

      {/* Withdraw Funds Section */}
      <div className="mb-12 w-full max-w-xl bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Withdraw Funds
        </h3>
        <p className="text-gray-600 mb-4">
          Withdraw funds from the payroll contract to your wallet.
        </p>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Amount to Withdraw
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 w-full border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={handleWithdrawFunds}
          disabled={loading}
          className={`px-6 py-3 text-white rounded-md w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Processing..." : "Withdraw Funds"}
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
