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
import { X } from "lucide-react";
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
  energyLevel: z.number().min(1).max(5).default(3),
  stressLevel: z.number().min(1).max(5).default(2),
  exerciseMinutes: z.number().min(0).default(0),
  nutritionNotes: z.string().optional(),
});

const SYMPTOMS = ["Cramps", "Headache", "Bloating", "Acne", "Tender Breasts"];

const MOODS_LOG = [
  "Calm",
  "Happy",
  "Anxious",
  "Tired",
  "Irritable",
  "Sad",
  "Focused",
  "Restless",
];

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
      energyLevel: 3,
      stressLevel: 2,
      exerciseMinutes: 0,
      nutritionNotes: "",
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
              energyLevel: res.data.energyLevel || 3,
              stressLevel: res.data.stressLevel || 2,
              exerciseMinutes: res.data.exerciseMinutes || 0,
              nutritionNotes: res.data.nutritionNotes || "",
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
              energyLevel: 3,
              stressLevel: 2,
              exerciseMinutes: 0,
              nutritionNotes: "",
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[480px] p-6 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-[#2D1F1A]">
            Log for {date ? format(date, "PPP") : ""}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#8C7B74]">
            Record your symptoms, moods, and hormonal health metrics for today.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-4"
          >
            {/* Symptoms */}
            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#2D1F1A]">
                    Symptoms
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {SYMPTOMS.map((symptom) => (
                      <FormField
                        key={symptom}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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
                            <FormLabel className="text-xs font-semibold text-[#8C7B74] cursor-pointer">
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

            {/* Moods */}
            <FormField
              control={form.control}
              name="moods"
              render={() => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#2D1F1A]">
                    Moods
                  </FormLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {MOODS_LOG.map((mood) => (
                      <FormField
                        key={mood}
                        control={form.control}
                        name="moods"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-y-0">
                            <FormControl>
                              <button
                                type="button"
                                onClick={() => {
                                  const isSelected =
                                    field.value?.includes(mood);
                                  if (isSelected) {
                                    field.onChange(
                                      field.value.filter((m) => m !== mood),
                                    );
                                  } else {
                                    field.onChange([
                                      ...(field.value || []),
                                      mood,
                                    ]);
                                  }
                                }}
                                className={`px-2.5 py-1.5 rounded-full text-[10px] font-extrabold border transition-all ${
                                  field.value?.includes(mood)
                                    ? "bg-[#FFF0ED] border-[#F6A58E] text-[#F6A58E]"
                                    : "bg-white border-zinc-200 text-[#8C7B74] hover:bg-zinc-50"
                                }`}
                              >
                                {mood}
                              </button>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Sleep Hours */}
            <FormField
              control={form.control}
              name="sleepHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#2D1F1A]">
                    Sleep (Hours)
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-1.5">
                      {SLEEP_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            field.value === option.value
                              ? "bg-[#F6A58E] text-white shadow-sm"
                              : "bg-zinc-100 text-[#8C7B74] hover:bg-zinc-200"
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

            {/* Water Intake */}
            <FormField
              control={form.control}
              name="waterIntake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#2D1F1A]">
                    Water Intake
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-1.5">
                      {WATER_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            field.value === option.value
                              ? "bg-[#8BC0D0] text-white shadow-sm"
                              : "bg-zinc-100 text-[#8C7B74] hover:bg-zinc-200"
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

            {/* Energy and Stress Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="energyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-[#2D1F1A] flex justify-between">
                      <span>Energy Level</span>
                      <span className="text-[#F6A58E]">{field.value}/5</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1.5 bg-[#FFFAF8] p-1 border rounded-xl">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => field.onChange(lvl)}
                            className={`flex-1 py-1 rounded-lg text-xs font-extrabold ${
                              field.value === lvl
                                ? "bg-[#F6A58E] text-white"
                                : "text-[#8C7B74]"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stressLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-[#2D1F1A] flex justify-between">
                      <span>Stress Level</span>
                      <span className="text-[#8BC0D0]">{field.value}/5</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1.5 bg-[#FFFAF8] p-1 border rounded-xl">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => field.onChange(lvl)}
                            className={`flex-1 py-1 rounded-lg text-xs font-extrabold ${
                              field.value === lvl
                                ? "bg-[#8BC0D0] text-white"
                                : "text-[#8C7B74]"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Exercise Minutes */}
            <FormField
              control={form.control}
              name="exerciseMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#2D1F1A] flex justify-between">
                    <span>Exercise (Minutes)</span>
                    <span className="text-[#F6A58E]">{field.value || 0}m</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        className="w-20 bg-[#FFFAF8] border border-rose-100 rounded-xl h-10 px-3 text-xs text-[#2D1F1A] focus:outline-none"
                      />
                      <div className="flex gap-1 flex-1">
                        {[15, 30, 45].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() =>
                              field.onChange((field.value || 0) + mins)
                            }
                            className="flex-1 h-10 rounded-xl bg-zinc-100 text-[#8C7B74] hover:bg-zinc-200 text-[10px] font-bold"
                          >
                            +{mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Nutrition Notes */}
            <FormField
              control={form.control}
              name="nutritionNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-[#2D1F1A]">
                    Nutrition Details
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="e.g., Magnesium supplements, avocado toast, high protein..."
                      {...field}
                      className="w-full bg-[#FFFAF8] border border-rose-100 rounded-xl p-3 text-xs text-[#2D1F1A] h-16 resize-none focus:outline-none focus:ring-1 focus:ring-[#F6A58E]/40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Period Day & Predicted Period Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isPeriodDay"
                render={({ field }) => (
                  <FormItem className="flex items-center space-y-0">
                    <FormControl>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !field.value;
                          field.onChange(nextVal);
                          if (nextVal) {
                            form.setValue("isPredictedPeriod", false);
                          }
                        }}
                        className={`flex-1 h-12 w-full rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          field.value
                            ? "bg-[#E8727A] border-[#E8727A] text-white shadow-sm"
                            : "bg-white border-[#8C7B74]/20 text-[#8C7B74] hover:bg-zinc-50"
                        }`}
                      >
                        Period Day
                        {field.value && (
                          <X size={14} className="stroke-[2.5]" />
                        )}
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPredictedPeriod"
                render={({ field }) => (
                  <FormItem className="flex items-center space-y-0">
                    <FormControl>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !field.value;
                          field.onChange(nextVal);
                          if (nextVal) {
                            form.setValue("isPeriodDay", false);
                          }
                        }}
                        className={`flex-1 h-12 w-full rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                          field.value
                            ? "bg-[#B89FD8] border-[#B89FD8] text-white shadow-sm"
                            : "bg-white border-[#8C7B74]/20 text-[#8C7B74] hover:bg-zinc-50"
                        }`}
                      >
                        Predicted Period
                        {field.value && (
                          <X size={14} className="stroke-[2.5]" />
                        )}
                      </button>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F6A58E] hover:bg-[#F5947A] text-white font-semibold py-2.5 rounded-xl text-xs active:scale-[0.98] transition-all"
            >
              Save Daily Log
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
