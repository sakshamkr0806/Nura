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

export function ArticleCard({ article }) {
  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <Badge
            variant="secondary"
            className="border-none bg-primary/10 text-primary hover:bg-primary/20"
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
