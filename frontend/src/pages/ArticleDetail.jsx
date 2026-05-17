import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloralDecoration } from "@/components/shared/Illustrations";
import api from "@/api/axios";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/articles/${slug}`)
      .then((res) => setArticle(res.data))
      .catch((err) => console.error("Failed to fetch article", err))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-[rgba(246,165,142,0.2)] border-t-[#F6A58E] animate-spin" />
        <p className="text-sm font-medium italic" style={{ color: "#8C7B74" }}>
          Loading article…
        </p>
      </div>
    );

  if (!article)
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-4xl">📚</p>
        <p
          className="font-serif font-bold text-2xl"
          style={{ color: "#2D1F1A" }}
        >
          Article not found
        </p>
        <Link to="/education">
          <button
            className="mt-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #F6A58E, #F8B6B6)" }}
          >
            Back to Education Hub
          </button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back button */}
      <Link to="/education">
        <button
          className="inline-flex items-center gap-2 text-sm font-bold transition-colors group"
          style={{ color: "#8C7B74" }}
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Education Hub
        </button>
      </Link>

      {/* Article Hero */}
      <div className="page-hero space-y-5">
        <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
          <FloralDecoration className="w-40 h-40" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ background: "rgba(246,165,142,0.12)", color: "#F6A58E" }}
          >
            {article.category}
          </span>
          <div
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#8C7B74" }}
          >
            <Clock size={13} style={{ color: "#F6A58E" }} />5 min read
          </div>
        </div>

        <h1
          className="font-serif font-bold leading-tight"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#2D1F1A" }}
        >
          {article.title}
        </h1>

        <p
          className="text-base font-medium leading-relaxed"
          style={{ color: "#8C7B74" }}
        >
          {article.excerpt}
        </p>

        {/* Author row */}
        <div
          className="flex items-center justify-between pt-2 border-t"
          style={{ borderColor: "rgba(246,165,142,0.12)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white"
              style={{
                background: "linear-gradient(135deg, #F6A58E, #CDB4F6)",
              }}
            >
              N
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#2D1F1A" }}>
                Nura Editorial
              </p>
              <p className="text-xs font-medium" style={{ color: "#8C7B74" }}>
                Clinical Advisor Reviewed
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-[rgba(246,165,142,0.08)]"
              style={{ color: "#8C7B74" }}
            >
              <Bookmark size={17} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-[rgba(246,165,142,0.08)]"
              style={{ color: "#8C7B74" }}
            >
              <Share2 size={17} />
            </Button>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div
        className="rounded-3xl border p-8 md:p-10"
        style={{
          background: "white",
          borderColor: "rgba(246,165,142,0.12)",
          boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
        }}
      >
        <div
          className="text-base leading-relaxed whitespace-pre-wrap font-medium"
          style={{ color: "#2D1F1A" }}
        >
          {article.content}
        </div>
      </div>

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag size={15} style={{ color: "#8C7B74" }} />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(234,220,248,0.4)", color: "#9B6FD4" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Helpful feedback */}
      <div
        className="rounded-3xl border-2 border-dashed p-8 text-center space-y-4"
        style={{ borderColor: "rgba(246,165,142,0.2)" }}
      >
        <h3
          className="font-serif font-bold text-xl"
          style={{ color: "#2D1F1A" }}
        >
          Was this helpful? 🌸
        </h3>
        <div className="flex justify-center gap-4">
          {["Yes ✓", "No ✗"].map((label) => (
            <button
              key={label}
              className="px-8 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all hover:scale-105"
              style={{ borderColor: "rgba(246,165,142,0.3)", color: "#F6A58E" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
