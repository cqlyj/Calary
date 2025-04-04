"use client";

import React, { useState, useEffect } from "react";
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";

const Calary: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [address, setAddress] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [role, setRole] = useState<"boss" | "worker" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolveEns = async () => {
      if (!input) return;

      try {
        const provider = new ethers.JsonRpcProvider(
          "https://eth-mainnet.g.alchemy.com/v2/zSlV7xFXjWsJeV7s2GNF8iVAban_r3-b"
        );

        if (input.toLowerCase().endsWith(".eth")) {
          const resolvedAddress = await provider.resolveName(input);
          if (resolvedAddress) {
            setAddress(resolvedAddress);
            setEnsName(input);
          }
        } else if (ethers.isAddress(input)) {
          const resolvedName = await provider.lookupAddress(input);
          setAddress(input);
          setEnsName(resolvedName);
        } else {
          setAddress(null);
          setEnsName(null);
        }
      } catch (error) {
        console.error("Error resolving ENS:", error);
        setAddress(null);
        setEnsName(null);
      }
    };

    resolveEns();
  }, [input]);

  const selfApp =
    address && role
      ? new SelfAppBuilder({
          appName: "Calary",
          scope: "Calary-Payroll",
          endpoint: "https://3738-111-235-226-130.ngrok-free.app/api/verify",
          userId: address,
          userIdType: "hex",
          disclosures: {
            nationality: true,
            minimumAge: 18,
            expiry_date: true,
            excludedCountries: ["IRN", "PRK"],
          },
          devMode: false,
        } as Partial<SelfApp>).build()
      : null;

  const handleSuccess = () => {
    console.log("Verification successful");
    if (role === "boss") {
      router.push("/boss");
    } else {
      router.push("/worker");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Welcome to Calary
      </h2>
      <p className="text-center text-gray-700 mb-6">
        A compliance-supported payroll system infrastructure.
      </p>

      {!role ? (
        <div className="flex space-x-4">
          <button
            onClick={() => setRole("boss")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Boss
          </button>
          <button
            onClick={() => setRole("worker")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Worker
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-gray-100 p-4 rounded shadow mt-6">
          <label className="block text-sm font-medium mb-2">
            Enter your wallet address or ENS:
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0x... or name.eth"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {ensName && ensName !== address && (
            <p className="mt-2 text-sm text-gray-600">✓ Resolved: {ensName}</p>
          )}
        </div>
      )}

      {address && selfApp && (
        <div className="mt-6">
          <SelfQRcodeWrapper
            selfApp={selfApp}
            type="websocket"
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default Calary;
