import { NextResponse, NextRequest } from "next/server";
import fs from "fs";

// Constants for error messages
const ERROR_MESSAGES = {
  INVALID_INPUT: "Invalid input provided",
  RAG_PROCESSING_FAILED: "Failed to process flow summary",
  API_ERROR: "API request failed",
};

export async function POST(req: NextRequest) {
  try {
    const { message, name } = await req.json();

    if (!message) {
      return new NextResponse(
        JSON.stringify({ error: ERROR_MESSAGES.INVALID_INPUT }),
        { status: 400 },
      );
    }

    // Parse the flow summary to ensure it's valid JSON
    let flowSummaryJSON;
    try {
      flowSummaryJSON = JSON.parse(message);
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid JSON in flow summary" }),
        { status: 400 },
      );
    }

    // SambaNova API call configuration
    const sambanovaOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer ab80b568-28fb-4528-a7b7-8265db3837a2",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stream: false,
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are a Solidity smart contract generator. Generate valid Solidity code (version ^0.8.0) with proper syntax, including:
            - SPDX license identifier
            - Pragma statement
            - Complete function implementations
            - Proper semicolons
            - Matching braces
            Only output the contract code, no explanations or markdown.`,
          },
          {
            role: "user",
            content: `Generate a Solidity smart contract based on the following flow summary: ${JSON.stringify(
              flowSummaryJSON,
            )}`,
          },
        ],
      }),
    };

    // Make the API call to SambaNova with proper error handling
    const response = await fetch(
      "https://api.sambanova.ai/v1/chat/completions",
      sambanovaOptions,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("SambaNova API Error:", errorData);
      throw new Error(errorData?.error?.message || ERROR_MESSAGES.API_ERROR);
    }

    const result = await response.json();

    if (!result?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from AI API");
    }

    // Extract and format the generated code
    const generatedCode = result.choices[0].message.content;
    const formattedCode = formatSolidityCode(generatedCode);

    // Update contract name to ContractDemo
    const contractName = "ContractDemo";
    const updatedCode = formattedCode.replace(
      /contract\s+\w+/,
      `contract ${contractName}`,
    );

    // Ensure directory exists and write file
    try {
      fs.writeFileSync("test.sol", updatedCode, "utf8");

      // Verify the file was written correctly
      const writtenContent = fs.readFileSync("test.sol", "utf8");
      if (writtenContent.trim() !== updatedCode.trim()) {
        throw new Error("File content verification failed");
      }

      console.log("Generated Solidity code:", updatedCode); // For debugging
    } catch (error) {
      console.error("File writing error:", error);
      throw new Error("Failed to save contract file: " + error.message);
    }

    return new NextResponse(
      JSON.stringify({
        fileName: "test.sol",
        contractName: contractName,
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Error in /send-to-rag:", error);
    return new NextResponse(
      JSON.stringify({
        error: error.message || ERROR_MESSAGES.RAG_PROCESSING_FAILED,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

function formatSolidityCode(code: string): string {
  // Remove markdown code block syntax if present
  let formattedCode = code
    .replace(/```solidity\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  // Ensure SPDX license identifier is present
  if (!formattedCode.includes("SPDX-License-Identifier")) {
    formattedCode = "// SPDX-License-Identifier: MIT\n" + formattedCode;
  }

  // Ensure pragma is present
  if (!formattedCode.includes("pragma solidity")) {
    formattedCode = formattedCode.replace(
      /(\/\/ SPDX-License-Identifier: MIT\n)/,
      "$1pragma solidity ^0.8.0;\n\n",
    );
  }

  // Basic syntax validation
  try {
    // Check for matching braces
    let braceCount = 0;
    for (const char of formattedCode) {
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;
      if (braceCount < 0) throw new Error("Unmatched braces in contract code");
    }
    if (braceCount !== 0) throw new Error("Unmatched braces in contract code");

    // Ensure each statement ends with a semicolon
    const statements = formattedCode.split("\n");
    formattedCode = statements
      .map((line) => {
        line = line.trim();
        if (
          line &&
          !line.endsWith(";") &&
          !line.endsWith("{") &&
          !line.endsWith("}") &&
          !line.startsWith("contract") &&
          !line.startsWith("pragma") &&
          !line.startsWith("//") &&
          !line.startsWith("/*") &&
          !line.endsWith("*/") &&
          !line.startsWith("interface") &&
          !line.startsWith("library")
        ) {
          return line + ";";
        }
        return line;
      })
      .join("\n");

    return formattedCode;
  } catch (error) {
    console.error("Error formatting Solidity code:", error);
    throw new Error("Invalid Solidity syntax: " + error.message);
  }
}
