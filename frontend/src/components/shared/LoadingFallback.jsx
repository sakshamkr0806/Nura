export function LoadingFallback() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ background: "#FFF9F7" }}
    >
      <div className="relative">
        {/* Outer ring pulse */}
        <div className="w-16 h-16 rounded-full border-4 border-[rgba(246,165,142,0.2)] absolute inset-0 animate-ping" />
        {/* Spinner */}
        <div className="w-16 h-16 rounded-full border-4 border-[rgba(246,165,142,0.15)] border-t-[#F6A58E] animate-spin" />
      </div>
      <p className="text-sm font-semibold italic" style={{ color: "#8C7B74" }}>
        Preparing your sanctuary…
      </p>
    </div>
  );
}
