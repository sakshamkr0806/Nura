import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  createdAt: string
}

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
            {article.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>5 min read</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.excerpt}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Link to={`/education/${article.slug}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            Read More
            <ArrowRight size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
