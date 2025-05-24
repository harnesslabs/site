export default function AboutSeperator() {
  return (
    <div className="">
      <svg
        className="mx-auto block w-full max-w-4xl h-64"
        viewBox="0 0 800 240"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="95"
          cy="160"
          r="40"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        <circle
          cx="400"
          cy="80"
          r="20"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        <circle
          cx="700"
          cy="140"
          r="30"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        <rect
          x="200"
          y="20"
          width="50"
          height="50"
          fill="none"
          stroke="black"
          strokeWidth="2"
          transform="rotate(25, 225, 75)"
        />
        <rect
          x="600"
          y="160"
          width="60"
          height="60"
          fill="none"
          stroke="black"
          strokeWidth="2"
          transform="rotate(-30, 630, 200)"
        />
        <rect
          x="300"
          y="120"
          width="40"
          height="80"
          fill="none"
          stroke="black"
          strokeWidth="2"
          transform="rotate(20, 320, 160)"
        />
        <polygon
          points="50,220 110,220 80,168"
          fill="none"
          stroke="black"
          strokeWidth="2"
          transform="rotate(5, 80, 203)"
        />
        <polygon
          points="500,100 550,100 525,57"
          fill="none"
          stroke="black"
          strokeWidth="2"
          transform="rotate(15, 525, 86)"
        />
      </svg>
    </div>
  );
}
