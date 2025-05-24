"use client";

import React, { useEffect, useState } from "react";

export default function Teaser() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  const textToType = "harnesslabs";
  const typingSpeed = 80;

  useEffect(() => {
    let currentIndex = 0;

    function typeNextCharacter() {
      if (currentIndex <= textToType.length) {
        setTypedText(textToType.slice(0, currentIndex));
        currentIndex++;
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setShowCursor(true);
      }
    }

    typeNextCharacter();
  }, []);

  return (
    <div className="text-center">
      <div className="text-4xl">
        <code className="font-medium">
          <span>{typedText || "\u00A0"}</span>
        </code>
        {showCursor && <span className="blink" />}
      </div>
      <div className="text-muted-foreground mt-4">coming soon...</div>

      <style jsx>{`
        .blink {
          display: inline-block;
          margin-left: 0.4em;
          margin-bottom: -2px;
          width: 2px;
          height: 0.8em;
          background-color: currentColor;
          animation: blink 1s steps(1) infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
