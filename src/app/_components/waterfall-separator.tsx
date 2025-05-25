export default function WaterfallSeparator() {
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
        <circle cx="10" cy="30" r="5" fill="transparent" stroke="currentColor" strokeWidth="2" />
        <circle cx="150" cy="100" r="40" fill="transparent" stroke="currentColor" strokeWidth="2" />
        <circle cx="390" cy="530" r="5" fill="transparent" stroke="currentColor" strokeWidth="2" />

        <rect
          x="90"
          y="80"
          width="50"
          height="50"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(25, 205, 75)"
        />
      </svg>
    </div>
  );
}
