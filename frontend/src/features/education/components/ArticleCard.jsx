import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PHASE_ACCENTS = {
  "understanding-menstrual-phase": {
    border: "border-t-4 border-t-[#E8727A]",
    bg: "bg-[#FFF0ED]",
    text: "text-[#E8727A]",
  },
  "understanding-follicular-phase": {
    border: "border-t-4 border-t-[#9B6FD4]",
    bg: "bg-[#F7F3FF]",
    text: "text-[#9B6FD4]",
  },
  "understanding-ovulatory-phase": {
    border: "border-t-4 border-t-[#F4956A]",
    bg: "bg-[#FFF5F2]",
    text: "text-[#F4956A]",
  },
  "understanding-luteal-phase": {
    border: "border-t-4 border-t-[#C3A6D4]",
    bg: "bg-[#F3ECF9]",
    text: "text-[#C3A6D4]",
  },
};

export function ArticleCard({ article }) {
  const accent = PHASE_ACCENTS[article.slug];

  return (
    <Card
      className={cn(
        "group flex h-full flex-col transition-shadow hover:shadow-md",
        accent?.border,
      )}
    >
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <Badge
            variant="secondary"
            className={cn(
              "border-none hover:opacity-90 transition-opacity",
              accent
                ? `${accent.bg} ${accent.text}`
                : "bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {article.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>5 min read</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 transition-colors group-hover:text-primary">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.excerpt}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link to={`/education/${article.slug}`} className="w-full">
          <Button
            variant="ghost"
            className="w-full justify-between transition-all group-hover:bg-primary group-hover:text-primary-foreground"
          >
            Read More
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
