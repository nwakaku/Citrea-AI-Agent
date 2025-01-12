import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { title: "DeFi", subtitle: "Most Popular", href: "/" },
  { title: "Derivatives", href: "/derivatives" },
  { title: "Prediction", href: "/prediction" },
  { title: "Rebalancing", href: "/rebalancing" },
  { title: "Gaming", href: "/gaming" },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-36 top-20 bg-gradient-to-b from-[#141313] to-[#1f1f1f] text-white h-screen fixed left-0 shadow-xl">
      <nav className="flex flex-col">
        <ul className="flex-1">
          {sidebarItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link legacyBehavior href={item.href} passHref>
                <a
                  className={`px-6 py-4 flex flex-col justify-center relative overflow-hidden group hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-transparent before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 border-b border-[#333333] shadow-sm ${
                    pathname === item.href ? "bg-[#E073FF]/20" : ""
                  }`}
                >
                  <div className="mb-1">
                    {item.subtitle && (
                      <span className="text-xs text-yellow-500 font-semibold block">
                        {item.subtitle}
                      </span>
                    )}
                    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300 ease-in-out">
                      {item.title}
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <footer className="p-2 mt-80 border-t border-[#333333] bg-gradient-to-t from-[#1f1f1f] to-[#141313] text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Citrea
          </p>
        </footer>
      </nav>
    </div>
  );
};

export default Sidebar;
