"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldTransition, setShouldTransition] = useState(false);

  const toggleMenu = () => {
    setShouldTransition(true);
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsMenuOpen(false);
        setShouldTransition(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="relative top-0 z-40">
      <div
        className={`mx-auto px-4 sm:px-12 py-4 flex items-start justify-between ${
          shouldTransition ? "transition-colors duration-300" : ""
        } ${isMenuOpen ? "bg-muted" : ""}`}
      >
        <Link
          href="/"
          className="flex items-center space-x-2 pt-1.5"
          onClick={() => setIsMenuOpen(false)}
        >
          <Icons.logo className="h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-start space-x-6">
          {siteConfig.nav.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="flex flex-col items-end space-y-1 border-t border-muted-foreground pt-2 pl-16"
            >
              {group.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm hover:text-muted-foreground transition-colors pr-2"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          <div
            className={`w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
              isMenuOpen ? "rotate-45" : "rotate-0"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1V15M1 8H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`sm:hidden absolute top-full left-0 w-full bg-muted border-b transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <nav className="px-4 py-8 space-y-3">
          {siteConfig.nav.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`space-y-3 transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: isMenuOpen ? `${groupIndex * 100}ms` : "0ms",
              }}
            >
              {group.map((item, itemIndex) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block text-sm hover:text-muted-foreground transition-all duration-200 transform ${
                    isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${groupIndex * 100 + itemIndex * 50}ms` : "0ms",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
