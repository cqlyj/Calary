"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";

const BossSelection: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { walletAddress, connectWallet } = useWallet();

  useEffect(() => {
    if (!walletAddress) {
      connectWallet(); // Ensure user is connected
    }
  }, [walletAddress, connectWallet]);

  const handleNext = () => {
    if (!selected) return;
    router.push(`/boss/${selected}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-5xl mx-auto relative">
        {/* Wallet Address Display */}
        {walletAddress && (
          <div className="absolute top-4 right-4 backdrop-blur-md bg-white/70 border border-gray-200 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <span className="text-xl">🦊</span>
            <span className="font-mono text-sm text-gray-800">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        )}

        {/* Main content card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Choose Payroll Type
            </h2>
            <p className="text-gray-600">
              Select a payroll mechanism to manage employee payments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => setSelected("time")}
              className={`p-5 rounded-xl shadow border-2 transition-all duration-200 text-left ${
                selected === "time"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">⏰ Time-based</h3>
              <p className="text-gray-600 text-sm">
                Automate payroll on regular time intervals.
              </p>
            </button>

            <button
              onClick={() => setSelected("custom")}
              className={`p-5 rounded-xl shadow border-2 transition-all duration-200 text-left ${
                selected === "custom"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">⚙️ Custom Logic</h3>
              <p className="text-gray-600 text-sm">
                Define your own rules and triggers for payroll.
              </p>
            </button>

            <button
              onClick={() => setSelected("milestone")}
              className={`p-5 rounded-xl shadow border-2 transition-all duration-200 text-left ${
                selected === "milestone"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">🏁 Milestone-based</h3>
              <p className="text-gray-600 text-sm">
                Release funds upon task or goal completion.
              </p>
            </button>
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleNext}
              disabled={!selected}
              className={`px-8 py-3 rounded-lg text-white text-lg font-medium transition ${
                selected
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BossSelection;
