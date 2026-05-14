import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
      <div className="animate-pulse p-10 text-center">Loading article...</div>
    );
  if (!article)
    return <div className="p-10 text-center">Article not found.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-10">
        <header className="space-y-6">
          <Link to="/education">
            <Button variant="ghost" size="sm" className="mb-4 gap-2">
              <ArrowLeft size={16} />
              Back to Education
            </Button>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className="border-none bg-primary/10 px-3 py-1 text-primary hover:bg-primary/20">
                {article.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>5 min read</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {article.title}
            </h1>

            <p className="text-xl leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between border-y py-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                CW
              </div>
              <div className="text-sm">
                <p className="font-bold">CycleWell Editorial</p>
                <p className="text-muted-foreground">
                  Clinical Advisor Reviewed
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Bookmark size={18} />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </header>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="space-y-4 whitespace-pre-wrap text-lg leading-relaxed text-foreground/90">
            {article.content}
          </div>
        </article>

        <Separator />

        <footer className="space-y-6 pt-6">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-muted-foreground" />
            <div className="flex gap-2">
              {article.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border bg-muted/40 p-6 text-center">
            <h3 className="text-xl font-bold">Was this article helpful?</h3>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="w-24">
                Yes
              </Button>
              <Button variant="outline" className="w-24">
                No
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
