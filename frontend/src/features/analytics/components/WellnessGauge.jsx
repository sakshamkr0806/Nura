export function WellnessGauge({ score, label = "Wellness Score" }) {
  const radius = 54;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const hasData = score && score > 0;
  const displayScore = hasData ? Math.min(score, 100) : 0;
  const offset = circumference - (displayScore / 100) * circumference;

  // Colour based on score
  const arcColor = hasData
    ? score >= 75
      ? "#DDEAD7"
      : score >= 50
        ? "#F8B6B6"
        : "#F6A58E"
    : "rgba(246,165,142,0.05)";
  const textColor = hasData
    ? score >= 75
      ? "#5A8A4E"
      : score >= 50
        ? "#C05E5E"
        : "#C07040"
    : "#A69994";

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
            stroke="rgba(246,165,142,0.06)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          {hasData && (
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
          )}
        </svg>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {hasData ? (
            <>
              <span
                className="font-serif font-bold text-4xl"
                style={{ color: textColor }}
              >
                {displayScore}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
                style={{ color: "#8C7B74" }}
              >
                / 100
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold text-[#8C7B74] leading-tight">
                Log data
              </span>
              <span className="text-[8px] font-medium text-[#A69994] leading-tight mt-0.5">
                to unlock
              </span>
            </>
          )}
        </div>
      </div>

      {hasData && (
        <span
          className="mt-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-center"
          style={{
            backgroundColor:
              score >= 75
                ? "rgba(221, 234, 213, 0.4)"
                : score >= 50
                  ? "rgba(248, 182, 182, 0.2)"
                  : "rgba(246, 165, 142, 0.15)",
            color: textColor,
          }}
        >
          {score >= 85
            ? "Excellent"
            : score >= 65
              ? "Good"
              : score >= 45
                ? "Fair"
                : "Needs attention"}
        </span>
      )}

      <p
        className="mt-3 text-xs font-bold uppercase tracking-wider"
        style={{ color: "#8C7B74" }}
      >
        {label}
      </p>
    </div>
  );
}
