export function WellnessGauge({ score, label = "Wellness Score" }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative h-48 w-48">
        <svg className="h-full w-full -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
