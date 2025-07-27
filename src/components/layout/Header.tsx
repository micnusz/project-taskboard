"use client";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="px-fluid py-4 border-b-1 drop-shadow-2xl">
      <nav className="flex flex-row justify-between">
        <div>
          <Link
            href="/"
            className="text-foreground hover:text-chart-3 flex flex-row items-center transition duration-200 ease-in-out"
          >
            <LayoutGrid className="w-5 h-5 mr-2" />
            <h1 className="text-base font-semibold">Dashboard</h1>
          </Link>
        </div>

        <div className="flex justify-end ">
          <a
            href="https://github.com/micnusz/project-taskboard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Go to github repository."
            className="text-foreground hover:text-muted-foreground flex flex-row items-center transition duration-200 ease-in-out"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            <h1 className="text-base font-semibold">GitHub</h1>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
