import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import { ContractFactory, ethers } from "ethers";
import solc from "solc";

export async function POST(req: NextRequest) {
  const { contractName } = await req.json();

  try {
    const filePath = "test.sol";
    const source = fs.readFileSync(filePath, "utf8");

    const input = {
      language: "Solidity",
      sources: {
        "test.sol": {
          content: source,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    console.log("Compiling contract:", contractName);
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Check if compilation was successful
    if (!output.contracts) {
      throw new Error("Compilation failed");
    }

    const contract = output.contracts["test.sol"][contractName];

    if (!contract) {
      throw new Error(
        `Contract ${contractName} not found in compilation output`,
      );
    }

    const bytecode = contract.evm.bytecode.object;
    const abi = contract.abi;

    if (!bytecode || !abi) {
      throw new Error("Missing bytecode or ABI in compilation output");
    }

    // Add '0x' prefix to bytecode if it's missing
    const formattedBytecode = bytecode.startsWith("0x")
      ? bytecode
      : `0x${bytecode}`;

    return NextResponse.json({
      bytecode: formattedBytecode,
      abi: abi,
    });
  } catch (error) {
    console.error("Compilation error:", error);
    return NextResponse.json(
      { error: error.message || "Contract compilation failed" },
      { status: 500 },
    );
  }
}
