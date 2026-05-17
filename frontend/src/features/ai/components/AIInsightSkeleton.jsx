export function AIInsightSkeleton() {
  return (
    <div
      className="w-full rounded-3xl border p-6 md:p-8 space-y-5"
      style={{ borderColor: "rgba(246,165,142,0.15)", background: "white" }}
    >
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-2xl animate-pulse"
          style={{ background: "#FEE5DC" }}
        />
        <div className="space-y-2 flex-1">
          <div
            className="h-4 w-36 rounded-full animate-pulse"
            style={{ background: "#FEE5DC" }}
          />
          <div
            className="h-3 w-48 rounded-full animate-pulse"
            style={{ background: "#FFF0EB" }}
          />
        </div>
      </div>
      {/* Text lines */}
      <div className="space-y-2">
        <div
          className="h-3.5 w-full rounded-full animate-pulse"
          style={{ background: "#FFF0EB" }}
        />
        <div
          className="h-3.5 w-11/12 rounded-full animate-pulse"
          style={{ background: "#FFF0EB" }}
        />
        <div
          className="h-3.5 w-3/4 rounded-full animate-pulse"
          style={{ background: "#FFF5F2" }}
        />
      </div>
      {/* Pill badges */}
      <div className="flex gap-2">
        {[24, 32, 20].map((w, i) => (
          <div
            key={i}
            className="h-7 rounded-full animate-pulse"
            style={{ width: `${w * 4}px`, background: "#FEE5DC" }}
          />
        ))}
      </div>
    </div>
  );
}
