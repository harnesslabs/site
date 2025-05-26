"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const symbolPool = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "∆",
  "∇",
  "∃",
  "∀",
  "∈",
  "∊",
  "≡",
  "≠",
  "≤",
  "≥",
  "∧",
  "v",
  "¬",
  "→",
  "↔",
  "⊕",
  "⊗",
  "⊙",
  "◊",
  "□",
  "◇",
  "■",
  "●",
  "○",
  "▲",
  "▼",
  "◄",
  "►",
];

export default function Hero() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const positions = 12;

  useEffect(() => {
    setSymbols(
      Array.from(
        { length: positions },
        () => symbolPool[Math.floor(Math.random() * symbolPool.length)]
      )
    );
    setIsLoaded(true);

    const interval = setInterval(() => {
      setSymbols((prev) =>
        prev.map((_, index) => {
          if (Math.random() < 0.15 + index * 0.02) {
            return symbolPool[Math.floor(Math.random() * symbolPool.length)];
          }
          return prev[index];
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="relative text-center space-y-2">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          Biological Abstractions
        </p>
        <div className="text-4xl tracking-wide uppercase flex items-center justify-center gap-2 min-h-[3rem]">
          {!isLoaded ? (
            <Skeleton className="w-80 h-10 rounded-md bg-background" />
          ) : (
            symbols.map((symbol, index) => (
              <span
                key={index}
                className={`
                  inline-block transition-all duration-300 ease-in-out transform
                  ${index % 3 === 0 ? "text-foreground" : index % 3 === 1 ? "text-muted-foreground/80" : "text-muted-foreground/60"}
                  hover:scale-110 hover:text-foreground
                  ${Math.random() > 0.7 ? "animate-pulse" : ""}
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                  textShadow: index % 4 === 0 ? "0 0 8px currentColor" : "none",
                }}
              >
                {symbol}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Subtle border lines */}
      <div className="absolute top-1 left-1/2 w-px h-16 bg-gradient-to-b from-transparent to-muted-foreground/50 transform -translate-x-1/2" />
      <div className="absolute bottom-4 left-1/2 w-px h-8 bg-gradient-to-t from-transparent to-muted-foreground/50 transform -translate-x-1/2" />
    </div>
  );
}
