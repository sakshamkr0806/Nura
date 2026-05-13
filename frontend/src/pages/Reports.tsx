import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { FileDown, FileText, Share2, Printer } from 'lucide-react'
import { ReportPreview } from '@/features/reports/components/ReportPreview'
import api from '@/api/axios'
import { toast } from 'sonner'

export default function Reports() {
  const [previewData, setPreviewData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    api
      .get('/reports/preview')
      .then((res) => setPreviewData(res.data))
      .catch((err) => console.error('Failed to fetch preview', err))
  }, [])

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/reports/export', {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'CycleWell_Doctor_Report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Report downloaded successfully')
    } catch (err) {
      toast.error('Failed to generate report')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctor-Ready Reports</h1>
          <p className="text-muted-foreground">
            Export your health data for your next clinical consultation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={16} />
            Print
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={isLoading}
          >
            <FileDown size={16} />
            {isLoading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-6">
            <h3 className="mb-2 flex items-center gap-2 font-bold">
              <FileText className="text-primary" size={20} />
              Report Configuration
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Select the data you want to include in your clinical export.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Cycle History</span>
                <span className="font-bold text-primary">Included</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Symptom Intensity</span>
                <span className="font-bold text-primary">Included</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Wellness Trends</span>
                <span className="font-bold text-primary">Included</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-muted p-6">
            <h3 className="mb-2 flex items-center gap-2 font-bold">
              <Share2 className="text-muted-foreground" size={20} />
              Share Securely
            </h3>
            <p className="text-sm text-muted-foreground">
              You can also generate a secure link to share this report with your
              doctor for 24 hours.
            </p>
            <Button variant="outline" className="mt-4 w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="history">Past Exports</TabsTrigger>
            </TabsList>
            <TabsContent
              value="preview"
              className="mt-4 rounded-xl border bg-background p-4 shadow-sm"
            >
              <ReportPreview data={previewData} />
            </TabsContent>
            <TabsContent
              value="history"
              className="mt-4 p-8 text-center text-muted-foreground"
            >
              No past exports found.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
