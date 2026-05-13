import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import { ArticleCard } from '@/features/education/components/ArticleCard'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import api from '@/api/axios'

const CATEGORIES = [
  'All',
  'Cycles',
  'Nutrition',
  'Mental Health',
  'Myth-Busting',
  'Lifestyle',
]

export default function Education() {
  const [articles, setArticles] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  const fetchArticles = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/articles', {
        params: { q: search, category: selectedCategory },
      })
      setArticles(res.data)
    } catch (err) {
      console.error('Failed to fetch articles', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchArticles, 300)
    return () => clearTimeout(timer)
  }, [search, selectedCategory])

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Hormonal Education Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Empower yourself with evidence-based hormonal health knowledge.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles, guides, myths..."
              className="h-11 bg-background pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="shrink-0 text-muted-foreground" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-1.5 text-sm transition-all hover:bg-primary/90 hover:text-primary-foreground"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </header>

      <section>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-xl bg-muted"
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
          <div className="rounded-2xl border border-dashed bg-muted/20 py-20 text-center">
            <p className="text-muted-foreground">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
