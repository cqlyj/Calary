"use client";

import React, { useState } from "react";
import { ethers } from "ethers";

const allowedTokens = [
  {
    name: "Polygon",
    symbol: "POL",
    address: "0x81F55140e2D2f277510d5913CEF357bc88dC185a",
    enabled: true,
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x0000000000000000000000000000000000000000",
    enabled: false,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    address: "0x0000000000000000000000000000000000000000",
    enabled: false,
  },
];

// Hardcoded contract
const contractAddress = "0x178D73364248E41a49a8aFDC68c6602f475e2483";
const contractABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "allowedTokens",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "_registry",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
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
  {
    type: "function",
    name: "claimPayroll",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
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
  {
    type: "function",
    name: "getAllowTokens",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEmployee",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TimeBasedPayroll.Employee",
        components: [
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
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEmployeeId",
    inputs: [
      {
        name: "connectedWallet",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOwner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPreference",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TimeBasedPayroll.Preference",
        components: [
          {
            name: "tokens",
            type: "address[]",
            internalType: "address[]",
          },
          {
            name: "percentages",
            type: "uint256[]",
            internalType: "uint256[]",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUsdcBalance",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUsdcContract",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPreferences",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tokens",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "percentages",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
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
  {
    type: "event",
    name: "DepositFunds",
    inputs: [
      {
        name: "amountOfUsdc",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EmployeeAdded",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "connectedWallet",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "salaryAmount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "lastPaymentDate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "interval",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PayrollClaimed",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "connectedWallet",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokens",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "percentages",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PreferencesSet",
    inputs: [
      {
        name: "employeeId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "tokens",
        type: "address[]",
        indexed: false,
        internalType: "address[]",
      },
      {
        name: "percentages",
        type: "uint256[]",
        indexed: false,
        internalType: "uint256[]",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Withdraw",
    inputs: [
      {
        name: "amountOfUsdc",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "Payroll__InsufficientFunds",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__InvalidEmployeeId",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__InvalidSumOfPercentages",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__MismatchedLength",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__NotAllowedChain",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__NotAllowedToken",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__NotAuthorized",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__NotDueYet",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__NotVerifiedEmployee",
    inputs: [],
  },
  {
    type: "error",
    name: "Payroll__TransferFailed",
    inputs: [],
  },
];

const EmployeePage: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [percentages, setPercentages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

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

  const toggleTokenSelection = (tokenAddress: string) => {
    const index = selectedTokens.indexOf(tokenAddress);
    const updatedTokens = [...selectedTokens];
    const updatedPercentages = [...percentages];

    if (index > -1) {
      updatedTokens.splice(index, 1);
      updatedPercentages.splice(index, 1);
    } else {
      updatedTokens.push(tokenAddress);
      updatedPercentages.push(0); // default %
    }

    setSelectedTokens(updatedTokens);
    setPercentages(updatedPercentages);
  };

  const updatePercentage = (index: number, value: number) => {
    const updated = [...percentages];
    updated[index] = value;
    setPercentages(updated);
  };

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

        {/* Get Employee ID */}
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

        {/* Set Preferences UI */}
        <div className="bg-gray-100 p-6 rounded-xl mb-8 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Set Token Preferences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {allowedTokens.map((token) => {
              const isSelected = selectedTokens.includes(token.address);
              const index = selectedTokens.indexOf(token.address);
              return (
                <div
                  key={token.symbol}
                  onClick={() =>
                    token.enabled && toggleTokenSelection(token.address)
                  }
                  className={`p-4 rounded-xl border-2 shadow cursor-pointer ${
                    isSelected
                      ? "border-blue-600 bg-blue-100"
                      : "border-gray-300"
                  } ${!token.enabled && "opacity-40 cursor-not-allowed"}`}
                >
                  <h3 className="text-lg font-semibold">{token.symbol}</h3>
                  <p className="text-sm text-gray-600">{token.name}</p>
                  {isSelected && (
                    <div className="mt-4">
                      <label className="text-sm block mb-1">Allocation %</label>
                      <input
                        onClick={(e) => e.stopPropagation()}
                        type="range"
                        min={0}
                        max={100}
                        value={percentages[index] || 0}
                        onChange={(e) =>
                          updatePercentage(index, parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                      <p className="text-sm text-blue-700 mt-1">
                        {percentages[index]}%
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={setEmployeePreferences}
            disabled={!employeeId || !selectedTokens.length || loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              selectedTokens.length && !loading
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
