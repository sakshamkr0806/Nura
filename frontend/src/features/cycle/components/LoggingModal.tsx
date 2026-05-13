import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import api from "@/api/axios"
import { toast } from "sonner"
import { useEffect } from "react"

const logSchema = z.object({
  symptoms: z.array(z.string()).default([]),
  moods: z.array(z.string()).default([]),
  sleepHours: z.number().min(0).max(24).default(8),
  waterIntake: z.number().min(0).default(2000),
  notes: z.string().optional(),
})

type LogFormValues = z.infer<typeof logSchema>

interface LoggingModalProps {
  date: Date | undefined
  isOpen: boolean
  onClose: () => void
}

const SYMPTOMS = ["Cramps", "Headache", "Bloating", "Acne", "Tender Breasts"]
const MOODS = ["Happy", "Sad", "Anxious", "Irritable", "Calm"]

export function LoggingModal({ date, isOpen, onClose }: LoggingModalProps) {
  const form = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      symptoms: [],
      moods: [],
      sleepHours: 8,
      waterIntake: 2000,
      notes: "",
    },
  })

  useEffect(() => {
    if (isOpen && date) {
      // Fetch existing log for this date
      api.get(`/logs/by-date?date=${date.toISOString()}`)
        .then(res => {
          if (res.data) {
            form.reset({
              symptoms: res.data.symptoms || [],
              moods: res.data.moods || [],
              sleepHours: res.data.sleepHours || 8,
              waterIntake: res.data.waterIntake || 2000,
              notes: res.data.notes || "",
            })
          } else {
            form.reset({
              symptoms: [],
              moods: [],
              sleepHours: 8,
              waterIntake: 2000,
              notes: "",
            })
          }
        })
    }
  }, [isOpen, date, form])

  async function onSubmit(values: LogFormValues) {
    if (!date) return

    try {
      await api.post("/logs", {
        ...values,
        date: date.toISOString(),
      })
      toast.success("Log saved successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to save log")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log for {date ? format(date, "PPP") : ""}</DialogTitle>
          <DialogDescription>
            Record your symptoms and health metrics for today.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {SYMPTOMS.map((symptom) => (
                      <FormField
                        key={symptom}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(symptom)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, symptom])
                                    : field.onChange(
                                        field.value?.filter((value) => value !== symptom)
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{symptom}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sleepHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep (Hours): {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={24}
                      step={0.5}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waterIntake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water (ml): {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={5000}
                      step={100}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Save Daily Log</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
