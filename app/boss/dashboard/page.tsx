"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

const BossDashboard: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<number | string>("0");
  const [salaryAmount, setSalaryAmount] = useState<string>("0");
  const [lastPaymentDate, setLastPaymentDate] = useState<string>("");
  const [interval, setInterval] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const [employeeWalletAddress, setEmployeeWalletAddress] =
    useState<string>("");

  const depositFunds = async () => {
    if (!amount || !window.ethereum) return;
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0xB1Ccfc014e8e692FB0a4a63514f75eCc5cb0E24B"; // Replace with actual deployed payroll contract address
      const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // USDC contract address
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
          outputs: [],
          stateMutability: "payable",
        },
      ];

      const usdcAbi = [
        {
          type: "function",
          name: "approve",
          inputs: [
            {
              name: "spender",
              type: "address",
              internalType: "address",
            },
            {
              name: "amount",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ];

      const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Convert amount to correct decimal (6 decimals for USDC)
      const parsedAmount = ethers.parseUnits(amount, 6);

      const txApproval = await usdcContract.approve(
        contractAddress,
        parsedAmount
      );
      await txApproval.wait();
      console.log("USDC approval completed");

      // Send the deposit transaction to the payroll contract
      const tx = await contract.depositFunds(parsedAmount, {
        gasLimit: 5000000, // Adjust gas limit as needed
      });

      await tx.wait();
      console.log("Funds deposited successfully");
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    // Check if all necessary fields are filled
    if (
      !employeeId ||
      !salaryAmount ||
      !employeeWalletAddress || // Make sure employee wallet address is provided
      !lastPaymentDate ||
      !interval ||
      !window.ethereum
    )
      return;

    setLoading(true);
    try {
      // Set up provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0xEc09534D989B7402a9D8f2Ef9433C8156dCE35Bf"; // Replace with actual deployed contract address
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
            {
              name: "lastPaymentDate",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "interval",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ];

      // Get the connected wallet address for the owner (boss)
      const connectedWallet = await signer.getAddress();

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Call the addEmployee function with the employee's wallet address
      const tx = await contract.addEmployee(
        employeeId,
        employeeWalletAddress, // Use the employee wallet address inputted by the user
        ethers.parseUnits(salaryAmount, 6), // Convert salaryAmount to the correct decimals
        new Date(lastPaymentDate).getTime() / 1000, // Convert date to Unix timestamp (seconds)
        interval
      );

      // Wait for the transaction to complete
      await tx.wait();
      console.log("Employee added successfully");
    } catch (error) {
      console.error("Add employee failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async () => {
    if (!amount || !window.ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0xEc09534D989B7402a9D8f2Ef9433C8156dCE35Bf"; // Replace with actual deployed contract address
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
          outputs: [],
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
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Boss Dashboard</h1>
        <p className="text-center text-gray-600 mb-8">
          Manage your payroll system and execute your admin functions here.
        </p>

        <div className="space-y-8">
          {/* Deposit Funds */}
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">💸 Deposit Funds</h2>
            <p className="text-gray-600 mb-4">
              Deposit funds to the contract for payroll distribution.
            </p>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USDC"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <button
              onClick={depositFunds}
              disabled={loading || !amount}
              className={`w-full py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Deposit Funds"}
            </button>
          </div>

          {/* Add Employee */}
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">👥 Add Employee</h2>
            <p className="text-gray-600 mb-4">
              Add an employee to the payroll with their payment details.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                // value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Employee ID"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Employee Wallet Address"
                // value={employeeWalletAddress}
                onChange={(e) => setEmployeeWalletAddress(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />

              <input
                type="text"
                // value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                placeholder="Salary Amount in USDC"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="date"
                value={lastPaymentDate}
                onChange={(e) => setLastPaymentDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                // value={interval}
                onChange={(e) => setInterval(e.target.value)}
                placeholder="Payment Interval (in seconds)"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              <button
                onClick={addEmployee}
                disabled={loading || !employeeId || !salaryAmount || !interval}
                className={`w-full py-2 rounded-md text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Processing..." : "Add Employee"}
              </button>
            </div>
          </div>

          {/* Withdraw Funds */}
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">💰 Withdraw Funds</h2>
            <p className="text-gray-600 mb-4">
              Withdraw funds from the contract to your wallet.
            </p>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USDC"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <button
              onClick={withdrawFunds}
              disabled={loading || !amount}
              className={`w-full py-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Processing..." : "Withdraw Funds"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossDashboard;
