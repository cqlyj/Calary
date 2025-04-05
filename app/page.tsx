"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import SelfQRcodeWrapper from "@selfxyz/qrcode";
import useWallet from "@/hooks/useWallet";

const Calary: React.FC = () => {
  const { walletAddress, connectWallet, disconnectWallet } = useWallet();
  const [role, setRole] = useState<"boss" | "worker" | null>(null);
  const router = useRouter();

  const selfApp =
    walletAddress && role
      ? new SelfAppBuilder({
          appName: "Calary",
          scope: "Calary-Payroll",
          endpoint: "https://27ad-111-235-226-130.ngrok-free.app/api/verify",
          userId: walletAddress,
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
    router.push(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Calary
          </h1>
          <p className="text-gray-600">
            A compliance-supported payroll system infrastructure.
          </p>
        </div>

        {!role ? (
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => setRole("boss")}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              I&apos;m a Boss
            </button>
            <button
              onClick={() => setRole("worker")}
              className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              I&apos;m a Worker
            </button>
          </div>
        ) : (
          <div className="text-center">
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Connected as:{" "}
                  <span className="font-mono">{walletAddress}</span>
                </p>
                <button
                  onClick={disconnectWallet}
                  className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        )}

        {walletAddress && selfApp && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
              Verify your identity
            </h3>
            <div className="flex justify-center">
              <SelfQRcodeWrapper
                selfApp={selfApp}
                type="websocket"
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calary;
