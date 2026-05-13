import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Share2, Bookmark, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import api from "@/api/axios"

export default function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then(res => setArticle(res.data))
      .catch(err => console.error("Failed to fetch article", err))
      .finally(() => setIsLoading(false))
  }, [slug])

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading article...</div>
  if (!article) return <div className="p-10 text-center">Article not found.</div>

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        <header className="space-y-6">
          <Link to="/education">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft size={16} />
              Back to Education
            </Button>
          </Link>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                {article.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>5 min read</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between py-2 border-y">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                CW
              </div>
              <div className="text-sm">
                <p className="font-bold">CycleWell Editorial</p>
                <p className="text-muted-foreground">Clinical Advisor Reviewed</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><Bookmark size={18} /></Button>
              <Button variant="ghost" size="icon"><Share2 size={18} /></Button>
            </div>
          </div>
        </header>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground/90 text-lg leading-relaxed space-y-4">
            {article.content}
          </div>
        </article>

        <Separator />

        <footer className="space-y-6 pt-6">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-muted-foreground" />
            <div className="flex gap-2">
              {article.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-muted/40 p-6 rounded-2xl border text-center space-y-4">
            <h3 className="font-bold text-xl">Was this article helpful?</h3>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="w-24">Yes</Button>
              <Button variant="outline" className="w-24">No</Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
