"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

const allowedTokens = [
  {
    name: "Polygon",
    symbol: "POL",
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
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

const registryAddress = "0xEf45029EDdABad3BeA56FC40D7DCc2053652B28F"; // Replace with actual address
const gasMasterAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Replace with actual Gas Master address

const MilestoneBasedSetup: React.FC = () => {
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [milestoneContract, setMilestoneContract] = useState<string>(""); // Milestone contract address
  const [eventSignature, setEventSignature] = useState<string>(""); // Event signature
  const [loading, setLoading] = useState(false);

  const deployPayroll = async () => {
    if (
      !selectedToken ||
      !milestoneContract ||
      !eventSignature ||
      !window.ethereum
    )
      return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const owner = await signer.getAddress();

      const contractABI = [""]; // Add ABI here
      const contractBytecode = ""; // Add bytecode here

      const factory = new ethers.ContractFactory(
        contractABI,
        contractBytecode,
        signer
      );
      const contract = await factory.deploy(
        owner,
        [selectedToken],
        registryAddress,
        gasMasterAddress,
        milestoneContract,
        ethers.hexlify(ethers.toUtf8Bytes(eventSignature)) // Convert event signature to bytes
      );
      await contract.waitForDeployment();

      console.log("Contract deployed at:", await contract.getAddress());
      router.push(
        `/milestone-dashboard?contractAddress=${await contract.getAddress()}`
      );
    } catch (err) {
      console.error("Deployment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">
          🚀 Create Milestone-Based Payroll
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Select the allowed tokens and provide the milestone contract and event
          signature for your payroll setup.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {allowedTokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => token.enabled && setSelectedToken(token.address)}
              disabled={!token.enabled}
              className={`flex flex-col items-start justify-between p-4 border-2 rounded-xl shadow transition-all duration-200 hover:shadow-md ${
                selectedToken === token.address
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300"
              } ${
                !token.enabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-blue-400"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold">{token.symbol}</h3>
                <p className="text-sm text-gray-600">{token.name}</p>
              </div>
              {token.enabled && selectedToken === token.address && (
                <span className="mt-2 text-xs text-blue-600 font-medium">
                  ✓ Selected
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label
            htmlFor="milestoneContract"
            className="block text-lg font-semibold mb-2"
          >
            Milestone Contract Address:
          </label>
          <input
            type="text"
            id="milestoneContract"
            className="w-full p-4 border-2 rounded-xl shadow-sm"
            placeholder="Enter milestone contract address"
            value={milestoneContract}
            onChange={(e) => setMilestoneContract(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="eventSignature"
            className="block text-lg font-semibold mb-2"
          >
            Milestone Event Signature:
          </label>
          <input
            type="text"
            id="eventSignature"
            className="w-full p-4 border-2 rounded-xl shadow-sm"
            placeholder="Enter event signature (e.g. 'MilestoneAchieved(address,uint256)')"
            value={eventSignature}
            onChange={(e) => setEventSignature(e.target.value)}
          />
        </div>

        <div className="text-center">
          <button
            onClick={deployPayroll}
            disabled={
              !selectedToken || !milestoneContract || !eventSignature || loading
            }
            className={`px-6 py-2 rounded text-white font-medium ${
              selectedToken && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Deploying Contract..." : "Deploy Payroll Contract"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneBasedSetup;
