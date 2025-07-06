"use client";
import { FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="px-fluid p-4 border-b-2">
      <nav className="flex flex-row justify-end">
        <a
          href="https://github.com/micnusz/project-taskboard"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Go to github repository."
          className="text-foreground hover:text-muted-foreground "
        >
          <FaGithub className="w-6 h-6" />
        </a>
      </nav>
    </header>
  );
};

export default Header;
