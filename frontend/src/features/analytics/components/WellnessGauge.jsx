export function WellnessGauge({ score, label = "Wellness Score" }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;

  // Colour based on score
  const arcColor =
    score >= 75 ? "#DDEAD7" : score >= 50 ? "#F8B6B6" : "#F6A58E";
  const textColor =
    score >= 75 ? "#5A8A4E" : score >= 50 ? "#C05E5E" : "#C07040";

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div
        className="relative"
        style={{ width: radius * 2, height: radius * 2 }}
      >
        <svg width={radius * 2} height={radius * 2} className="-rotate-90">
          {/* Track */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke="rgba(246,165,142,0.1)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="none"
            stroke={arcColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        </svg>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-serif font-bold text-4xl"
            style={{ color: textColor }}
          >
            {score}
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: "#8C7B74" }}
          >
            / 100
          </span>
        </div>
      </div>

      <p
        className="mt-3 text-xs font-bold uppercase tracking-wider"
        style={{ color: "#8C7B74" }}
      >
        {label}
      </p>
    </div>
  );
}
