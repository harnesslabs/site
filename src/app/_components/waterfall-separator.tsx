"use client";

import { useEffect, useRef, useState } from "react";

export default function WaterfallSeparator() {
  const rotatingTriangleRef = useRef<SVGPolygonElement>(null);
  const [rotation, setRotation] = useState(0);

  const triangleCenterX = 315;
  const triangleCenterY = 372.5;

  useEffect(() => {
    const handleScroll = () => {
      const newRotation = window.scrollY / 5;
      setRotation(newRotation);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (rotatingTriangleRef.current) {
      rotatingTriangleRef.current.setAttribute(
        "transform",
        `rotate(${rotation}, ${triangleCenterX}, ${triangleCenterY})`
      );
    }
  }, [rotation, triangleCenterX, triangleCenterY]);

  return (
    <div className="w-full h-full flex items-center justify-start overflow-hidden">
      <svg width="400" height="540" viewBox="0 0 400 540" xmlns="http://www.w3.org/2000/svg">
        <style type="text/css">{`
          circle,
          rect,
          polygon {
            pointer-events: all;
            transition: fill 0.2s;
          }
          circle:hover {
            fill: red;
          }
          rect:hover{
            fill: green;
          }
          polygon:hover {
            fill: blue;
          }
        `}</style>
        <circle cx="15" cy="30" r="10" fill="currentColor" stroke="currentColor" strokeWidth="2" />
        <circle cx="160" cy="110" r="60" fill="transparent" stroke="currentColor" strokeWidth="2" />
        <circle cx="330" cy="300" r="30" fill="transparent" stroke="currentColor" strokeWidth="2" />

        <rect
          x="200"
          y="90"
          width="80"
          height="80"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(10, 105, 30)"
        />
        <rect
          x="90"
          y="80"
          width="50"
          height="50"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(25, 205, 75)"
        />
        <rect
          x="250"
          y="220"
          width="80"
          height="50"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(30, 200, 160)"
        />
        <rect
          x="320"
          y="80"
          width="40"
          height="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(15, 340, 100)"
        />

        <polygon
          points="347,510 397,510 372,467"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(184, 372, 490)"
        />

        <polygon
          ref={rotatingTriangleRef}
          points="280,400 350,400 315,345"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
