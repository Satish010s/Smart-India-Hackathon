"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { LuMenu, LuX, LuMoon, LuSun, LuCpu } from "react-icons/lu";
import gsap from "gsap";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Navbar entrance animation
    gsap.fromTo(".navbar-entrance", 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar-entrance fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white">
              <LuCpu size={20} />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-[var(--color-text)]">
              QubitMind
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Learn', 'Playground', 'Features', 'How It Works', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                {item}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-[var(--color-border)]/50 transition-colors text-[var(--color-muted)] hover:text-[var(--color-text)]"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
              </button>
            )}
            <button className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
              Login
            </button>
            <button className="bg-[var(--color-text)] text-[var(--color-background)] px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
             {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-[var(--color-muted)]"
              >
                {theme === "dark" ? <LuSun size={20} /> : <LuMoon size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[var(--color-text)]"
            >
              {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 pt-2 pb-4 space-y-1 shadow-lg">
           {['Learn', 'Playground', 'Features', 'How It Works', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]/20">
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-2">
              <button className="w-full text-center px-4 py-2 border border-[var(--color-border)] rounded-md font-medium text-[var(--color-text)]">
                Login
              </button>
               <button className="w-full text-center px-4 py-2 bg-[var(--color-text)] text-[var(--color-background)] rounded-md font-medium">
                Get Started
              </button>
            </div>
        </div>
      )}
    </header>
  );
}
