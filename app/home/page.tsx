"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Sparkles, HeartCrack } from "lucide-react";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaClose,
} from "@/components/credeza";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen text-white">
      <Sidebar />
      <Navbar />
      <div className="pl-64 flex flex-col items-center justify-center text-center min-h-screen w-full px-4">
        <div className="flex flex-row py-2 px-3 bg-gradient-to-r from-[#3a2a1b] to-[#4b3623] rounded-full border border-[#6d4a2e] justify-center items-center mb-6 shadow-md">
          <div className="text-[#de8d41] text-sm font-medium flex flex-row items-center">
            No Projects Deployed Yet <HeartCrack className="ml-2 h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-col space-y-6 w-full max-w-lg">
          <p className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-600 text-transparent bg-clip-text">
            {" "}
            Powerful Citrea AI Agent
          </p>
          <div className="flex flex-col space-y-4 px-8">
            <RainbowButton
              className="h-12 rounded-lg text-base font-semibold group shadow-lg"
              onClick={() => router.push("/")}
            >
              Start
              <Sparkles className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </RainbowButton>
          </div>
        </div>
      </div>

      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Create Project with AI</CredenzaTitle>
            <CredenzaDescription>
              Describe your project, and our AI will help you create it.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <textarea
              className="w-full h-40 p-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#de8d41]"
              placeholder="Describe your project here..."
            />
            <div className="flex justify-end mt-6">
              <CredenzaClose asChild>
                <Button variant="outline" className="mr-3">
                  Cancel
                </Button>
              </CredenzaClose>
              <Button>Create Project</Button>
            </div>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  );
};

export default HomePage;
