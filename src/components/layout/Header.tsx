"use client";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="px-fluid py-4 border-b-2">
      <nav>
        <div>
          <a
            href="https://github.com/micnusz/project-taskboard"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Go to github repository."
            className="text-foreground hover:text-muted-foreground "
          >
            <div className="flex flex-row gap-x-4 hover:text-chart-3">
              <FaGithub className="w-6 h-6" />
              <h1>Project Taskboard</h1>
            </div>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
