import { Sparkles, Info } from "lucide-react";

export function AIInsightCard({ insight }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border p-6 md:p-8"
      style={{
        background:
          "linear-gradient(135deg, rgba(248,182,182,0.12) 0%, rgba(255,255,255,1) 60%, rgba(234,220,248,0.08) 100%)",
        borderColor: "rgba(246,165,142,0.2)",
        boxShadow: "0 4px 32px rgba(200,150,130,0.1)",
      }}
    >
      {/* Decorative glow blob */}
      <div
        className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(248,182,182,0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div
          className="p-2.5 rounded-2xl shrink-0"
          style={{ background: "linear-gradient(135deg, #F6A58E, #F8B6B6)" }}
        >
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h3
            className="font-serif font-bold text-xl"
            style={{ color: "#2D1F1A" }}
          >
            AI Wellness Summary
          </h3>
          <p
            className="text-xs font-medium mt-0.5"
            style={{ color: "#F6A58E" }}
          >
            Personalised insights based on your recent activity
          </p>
        </div>
      </div>

      {/* Summary */}
      <p
        className="text-sm leading-relaxed font-medium mb-6"
        style={{ color: "#2D1F1A" }}
      >
        {insight.summary}
      </p>

      {/* Recommendations */}
      {insight.recommendations?.length > 0 && (
        <div className="mb-6 space-y-3">
          <h4
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "#8C7B74" }}
          >
            Suggested Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {insight.recommendations.map((rec, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(246,165,142,0.1)",
                  color: "#F6A58E",
                  border: "1px solid rgba(246,165,142,0.2)",
                }}
              >
                {rec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Educational note */}
      {insight.educationalNote && (
        <div
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            background: "rgba(234,220,248,0.2)",
            border: "1px solid rgba(205,180,246,0.25)",
          }}
        >
          <Info
            size={16}
            className="shrink-0 mt-0.5"
            style={{ color: "#CDB4F6" }}
          />
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mb-1"
              style={{ color: "#8C7B74" }}
            >
              Educational Note
            </p>
            <p
              className="text-xs leading-relaxed font-medium"
              style={{ color: "#8C7B74" }}
            >
              {insight.educationalNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
