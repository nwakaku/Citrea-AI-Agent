"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FlowGraph from "@/app/compile/FlowGraph";
import ContractDeployment from "./ContractDeployement";
import { Button } from "@/components/ui/button";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { ArrowLeft, Blocks as BlocksIcon } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { deployContract } from "@wagmi/core";
import { config } from "../../lib/wagmi";

interface CompilationResult {
  abi: any[];
  bytecode: string;
}

const CompilePage: React.FC = () => {
  const searchParams = useSearchParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [flowSummary, setFlowSummary] = useState([]);
  const [compilationResult, setCompilationResult] =
    useState<CompilationResult | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const nodesParam = searchParams.get("nodes");
    const edgesParam = searchParams.get("edges");
    const flowSummaryParam = searchParams.get("flowSummary");
    if (nodesParam && edgesParam && flowSummaryParam) {
      setNodes(JSON.parse(decodeURIComponent(nodesParam)));
      setEdges(JSON.parse(decodeURIComponent(edgesParam)));
      setFlowSummary(JSON.parse(decodeURIComponent(flowSummaryParam)));
    }
  }, [searchParams]);

  const handleCompile = async () => {
    setIsCompiling(true);
    setError(null);

    try {
      // First, send to RAG
      const flowSummaryJSON = {
        nodes: nodes,
        edges: edges,
        summary: flowSummary,
      };

      console.log("Sending to RAG:", flowSummaryJSON);

      const ragResponse = await fetch("/send-to-rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: JSON.stringify(flowSummaryJSON),
          name: "",
        }),
      });

      if (!ragResponse.ok) {
        const errorData = await ragResponse.json();
        throw new Error(errorData.error || "Failed to process flow summary");
      }

      const ragResult = await ragResponse.json();
      console.log("RAG result:", ragResult);

      // Then compile the contract
      const compilationResponse = await fetch("/compile-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractName: ragResult.contractName,
        }),
      });

      if (!compilationResponse.ok) {
        const errorData = await compilationResponse.json();
        throw new Error(errorData.error || "Compilation failed");
      }

      const result = await compilationResponse.json();
      console.log("Compilation result:", result);

      if (!result.abi || !result.bytecode) {
        throw new Error("Invalid compilation result - missing ABI or bytecode");
      }

      setCompilationResult(result);
    } catch (err) {
      console.error("Compilation error:", err);
      setError(err.message || "Failed to compile contract");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDeploy = async () => {
    console.log(compilationResult);
    if (!compilationResult?.abi || !compilationResult?.bytecode) {
      setError("Please compile the contract first");
      return;
    }

    try {
      setError(null);
      const result = await deployContract(config, {
        abi: compilationResult.abi,
        bytecode: compilationResult.bytecode as `0x${string}`,
        args: [], // If your contract needs constructor arguments, add them here
      });

      setHash(result as `0x${string}`);
    } catch (err) {
      setError(err.message || "Failed to deploy contract");
      console.error("Deployment error:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      <Navbar />
      <div className="absolute top-20 right-4 hover:none">
        <ConnectButton />
      </div>
      <Sidebar />

      <div className="flex-grow flex w-full px-32 py-16">
        <main className="flex-grow flex">
          <section className="w-1/2 p-4 py-12">
            <div className="flex flex-col ml-5">
              <h2 className="text-lg mb-4">Flow Graph</h2>
              <FlowGraph
                nodes={nodes}
                edges={edges}
                flowSummary={flowSummary}
              />
            </div>

            <div className="flex flex-row ml-5 mt-10 mb-4">
              <ConnectButton />
            </div>

            <div className="flex flex-row gap-4 ml-4">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="mb-4 group text-white/50 hover:text-white hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                  Back
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="mb-4 group text-white/50 hover:text-white hover:bg-white/5"
                onClick={handleCompile}
                disabled={isCompiling}
              >
                <BlocksIcon className="w-4 h-4 mr-1 translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                {isCompiling ? "Compiling..." : "Compile"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 ml-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            {compilationResult && (
              <div className="mt-4 ml-4">
                <h3 className="text-lg font-normal mb-2">
                  Compilation Result:
                </h3>
                <div className="bg-[#1F1F1F] border-[1px] border-white/10 p-4 overflow-x-auto">
                  <div className="text-sm font-mono text-white/80 whitespace-pre-wrap">
                    {JSON.stringify(compilationResult, null, 2)}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="w-1/2 p-4">
            {hash ? (
              <ContractDeployment hash={hash} />
            ) : (
              <ContractDeployment hash={`0x${"TX Hash will appear here"}`} />
            )}
          </section>
        </main>
      </div>

      <div className="fixed bottom-4 right-4">
        <Button
          variant="default"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleDeploy}
          //   disabled={!compilationResult || isCompiling}
        >
          <BlocksIcon className="w-4 h-4 mr-2" />
          Deploy Contract
        </Button>
      </div>

      {hash && (
        <div className="fixed bottom-16 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Contract Deployed</h3>
          <p className="text-sm">Transaction Hash:</p>
          <p className="text-xs font-mono break-all">{hash}</p>
        </div>
      )}
    </div>
  );
};

export default CompilePage;
