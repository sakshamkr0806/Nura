import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ArticleCard } from "@/features/education/components/ArticleCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import api from "@/api/axios";

const CATEGORIES = [
  "All",
  "Cycles",
  "Nutrition",
  "Mental Health",
  "Myth-Busting",
  "Lifestyle",
];

export default function Education() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const tabFromUrl = searchParams.get("tab") || "All";
  const selectedCategory =
    CATEGORIES.find((cat) => cat.toLowerCase() === tabFromUrl.toLowerCase()) ||
    "All";

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/articles", {
        params: { q: search, category: selectedCategory },
      });

      // exact sort order for all articles across categories
      const PHASE_ORDER = {
        // Cycles Tab
        "understanding-menstrual-phase": 1,
        "understanding-follicular-phase": 2,
        "understanding-ovulatory-phase": 3,
        "understanding-luteal-phase": 4,

        // Nutrition Tab
        "nutrition-menstrual-phase": 10,
        "nutrition-follicular-phase": 11,
        "nutrition-ovulatory-phase": 12,
        "nutrition-luteal-phase": 13,
        "nutrition-hormonal-balance": 14,

        // Mental Health Tab
        "mood-menstrual-cycle": 20,
        "cycle-sleep-connection": 21,
        "managing-pms-pmdd": 22,

        // Myth-Busting Tab
        "myth-period-pain-normal": 30,
        "myth-pregnant-during-period": 31,
        "myth-irregular-periods-normal": 32,

        // Lifestyle Tab
        "exercise-cycle-train-smarter": 40,
        "cycle-syncing-your-diet": 41,
        "stress-hormonal-balance": 42,
      };

      const sorted = [...res.data].sort((a, b) => {
        const orderA = PHASE_ORDER[a.slug] || 999;
        const orderB = PHASE_ORDER[b.slug] || 999;
        return orderA - orderB;
      });

      setArticles(sorted);
    } catch {
      // Silently handle error
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="page-hero">
        <h1
          className="font-serif font-bold text-4xl"
          style={{ color: "#2D1F1A" }}
        >
          Education Hub 📚
        </h1>
        <p className="mt-1 text-sm font-medium" style={{ color: "#8C7B74" }}>
          Empower yourself with evidence-based hormonal health knowledge.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "#F6A58E" }}
          />
          <Input
            placeholder="Search articles, guides, myths..."
            className="pl-11 h-12 rounded-2xl border text-sm"
            style={{
              borderColor: "rgba(246,165,142,0.25)",
              background: "white",
              boxShadow: "0 2px 12px rgba(200,150,130,0.08)",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap pb-1">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("tab", cat.toLowerCase());
                  setSearchParams(newParams);
                }}
                className="px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 shrink-0"
                style={
                  selectedCategory === cat
                    ? {
                        background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                        color: "white",
                        boxShadow: "0 2px 10px rgba(246,165,142,0.3)",
                      }
                    : {
                        background: "white",
                        color: "#8C7B74",
                        border: "1.5px solid rgba(246,165,142,0.2)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Articles grid */}
      <section>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl"
                style={{ background: "#FFF0ED" }}
              />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border-2 border-dashed py-20 text-center"
            style={{
              borderColor: "rgba(246,165,142,0.2)",
              background: "rgba(255,255,255,0.5)",
            }}
          >
            <p className="text-2xl mb-3">🌸</p>
            <p className="text-sm font-medium" style={{ color: "#8C7B74" }}>
              No articles found matching your search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
