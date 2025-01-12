import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FolderKanban, GraduationCap, Bug, LucideBot } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed w-full bg-gradient-to-r from-[#141313] to-[#1f1f1f] text-white border-b border-gray-700 shadow-lg z-50">
      <div className=" mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 cursor-pointer">
          <Link href={"/home"}>
            <div className="flex items-center space-x-2">
              <LucideBot />
              <span className="text-xl font-bold text-yellow-500">
                Citrea AI Agent
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <NavItem icon={<FolderKanban size={18} />} text="Home" href="/home" />
          <NavItem
            icon={<FolderKanban size={18} />}
            text="Docs"
            href="/https://docs.citrea.xyz/"
          />
          <NavItem
            icon={<FolderKanban size={18} />}
            text="Hackathon"
            href="https://encodeclub.notion.site/33a9d8f043f2459397841bb97b9b9386?v=d44218d76410443c8fcc585fdf270712&p=1426c123e77d80d29ac9da241ec029f0&pm=s"
          />
          <NavItem
            icon={<GraduationCap size={18} />}
            text="Videos"
            href="https://www.youtube.com/@CitreaOnYT"
          />
          <NavItem
            icon={<Bug size={18} />}
            text="Report Bug"
            href="/report-bug"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} passHref>
      <div className="group relative inline-flex items-center px-4 py-2 cursor-pointer">
        <span className="text-white font-medium text-sm z-10 group-hover:text-yellow-400 transition duration-300">
          {text}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 translate-y-full group-hover:translate-y-1/2 blur-md rounded-full bg-gradient-to-r from-[#E073FF]/50 to-[#E073FF]/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </div>
      </div>
    </Link>
  );
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        className="text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">☰</span>
      </button>
      {isOpen && (
        <div className="absolute top-20 right-0 w-64 bg-[#1f1f1f] shadow-lg rounded-lg">
          <ul className="flex flex-col space-y-4 p-4 text-white">
            <li>
              <Link href="/home" passHref>
                <span className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                  Projects
                </span>
              </Link>
            </li>
            <li>
              <Link href="/files" passHref>
                <span className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                  Files
                </span>
              </Link>
            </li>
            <li>
              <Link href="/login" passHref>
                <span className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                  Login Test
                </span>
              </Link>
            </li>
            <li>
              <Link href="/tutorials" passHref>
                <span className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                  Tutorials
                </span>
              </Link>
            </li>
            <li>
              <Link href="/report-bug" passHref>
                <span className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                  Report Bug
                </span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
