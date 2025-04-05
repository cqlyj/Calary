// app/api/run-swap/route.ts

import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(request: Request) {
  console.log("🔥 API hit: /api/run-swap");

  const cwd = process.cwd(); // current working directory
  console.log("📁 Running Makefile command in directory:", cwd);

  const command = "make swap";
  console.log("📦 Running command:", command);

  return new Promise<NextResponse>((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error("💥 Error running swap:", error);
        console.error("🐛 STDERR:", stderr);
        return resolve(
          NextResponse.json(
            { error: "Swap failed", details: stderr || error.message },
            { status: 500 }
          )
        );
      }

      console.log("✅ Swap command completed.");
      console.log("📤 STDOUT:", stdout);
      return resolve(NextResponse.json({ output: stdout }, { status: 200 }));
    });
  });
}
