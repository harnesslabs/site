"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutSeparator() {
  const rotatingTriangleRef = useRef<SVGPolygonElement>(null);
  const [rotation, setRotation] = useState(0);

  const triangleCenterX = 495;
  const triangleCenterY = 257 / 3;

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
  }, [rotation, triangleCenterY]);

  return (
    <div className="max-w-3xl mx-auto">
      <svg className="w-full" viewBox="0 0 770 240" xmlns="http://www.w3.org/2000/svg">
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

        <circle cx="65" cy="160" r="40" fill="transparent" stroke="currentColor" strokeWidth="2" />
        <circle cx="370" cy="80" r="20" fill="transparent" stroke="currentColor" strokeWidth="2" />
        <circle cx="670" cy="140" r="30" fill="transparent" stroke="currentColor" strokeWidth="2" />
        <circle cx="570" cy="25" r="7" fill="currentColor" stroke="currentColor" strokeWidth="2" />

        <rect
          x="200"
          y="80"
          width="50"
          height="50"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(120, 205, 100)"
        />
        <rect
          x="603"
          y="155"
          width="70"
          height="70"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(-30, 610, 200)"
        />
        <rect
          x="420"
          y="120"
          width="30"
          height="30"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(-5, 480, 0)"
        />
        <rect
          x="270"
          y="120"
          width="40"
          height="80"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(20, 300, 160)"
        />

        <polygon
          points="50,220 110,220 80,168"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(5, 90, 203)"
        />
        <polygon
          ref={rotatingTriangleRef}
          points="470,100 520,100 495,57"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        />
        <polygon
          points="670,80 760,80 715,5"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
