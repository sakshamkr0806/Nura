import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import api from "@/api/axios";
import { toast } from "sonner";
import { useEffect } from "react";

const logSchema = z.object({
  symptoms: z.array(z.string()),
  moods: z.array(z.string()),
  sleepHours: z.number().min(0).max(24),
  isPeriodDay: z.boolean().default(false),
  isPredictedPeriod: z.boolean().default(false),
  waterIntake: z.number().min(0).default(0),
  notes: z.string().optional(),
});

const SYMPTOMS = ["Cramps", "Headache", "Bloating", "Acne", "Tender Breasts"];

const SLEEP_OPTIONS = [
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10+" },
];

const WATER_OPTIONS = [
  { value: 500, label: "500ml" },
  { value: 1000, label: "1L" },
  { value: 1500, label: "1.5L" },
  { value: 2000, label: "2L" },
  { value: 2500, label: "2.5L" },
  { value: 3000, label: "3L+" },
];

export function LoggingModal({ date, isOpen, onClose, onSave }) {
  const form = useForm({
    resolver: zodResolver(logSchema),
    defaultValues: {
      symptoms: [],
      moods: [],
      sleepHours: 8,
      waterIntake: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen && date) {
      api
        .get(`/logs/by-date?date=${format(date, "yyyy-MM-dd")}`)
        .then((res) => {
          if (res.data) {
            form.reset({
              symptoms:
                res.data.symptoms?.filter(
                  (s) => s !== "Period Day" && s !== "Predicted Period",
                ) || [],
              isPeriodDay: res.data.symptoms?.includes("Period Day") || false,
              isPredictedPeriod:
                res.data.symptoms?.includes("Predicted Period") || false,
              moods: res.data.moods || [],
              sleepHours: res.data.sleepHours || 8,
              waterIntake: res.data.waterIntake || 0,
              notes: res.data.notes || "",
            });
          } else {
            form.reset({
              symptoms: [],
              isPeriodDay: false,
              isPredictedPeriod: false,
              moods: [],
              sleepHours: 8,
              waterIntake: 0,
              notes: "",
            });
          }
        });
    }
  }, [isOpen, date, form]);

  async function onSubmit(values) {
    if (!date) return;
    try {
      const finalSymptoms = [...values.symptoms];
      if (values.isPeriodDay) finalSymptoms.push("Period Day");
      if (values.isPredictedPeriod) finalSymptoms.push("Predicted Period");

      // Extract isPeriodDay and isPredictedPeriod so they don't get sent to backend
      const { isPeriodDay: _, isPredictedPeriod: __, ...payload } = values;

      await api.post("/logs", {
        ...payload,
        symptoms: finalSymptoms,
        date: format(date, "yyyy-MM-dd"),
      });
      toast.success("Log saved successfully");
      if (onSave) onSave();
      onClose();
    } catch (_error) {
      toast.error("Failed to save log");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
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
                                        field.value?.filter(
                                          (value) => value !== symptom,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {symptom}
                            </FormLabel>
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
                  <FormLabel>Sleep (Hours)</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {SLEEP_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            field.value === option.value
                              ? "bg-[#F6A58E] text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waterIntake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Water Intake</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {WATER_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                            field.value === option.value
                              ? "bg-[#8BC0D0] text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isPeriodDay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3 shadow-sm bg-white">
                    <div className="space-y-0.5">
                      <FormLabel className="font-medium text-sm text-[#2D1F1A]">
                        Period Day
                      </FormLabel>
                    </div>
                    <FormControl>
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${field.value ? "bg-[#F8B6B6]" : "bg-gray-200"}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${field.value ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPredictedPeriod"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3 shadow-sm bg-white">
                    <div className="space-y-0.5">
                      <FormLabel className="font-medium text-sm text-[#2D1F1A]">
                        Predicted Period
                      </FormLabel>
                    </div>
                    <FormControl>
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${field.value ? "bg-[#F8B6B6]" : "bg-gray-200"}`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${field.value ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Daily Log
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
