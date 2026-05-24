import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Moon,
  Droplets,
  Heart,
  Activity,
  Smile,
  CheckCircle,
} from "lucide-react";
import { decodeJwt } from "@/utils/jwt";

const STEPS = [
  { id: "welcome", title: "Welcome" },
  { id: "menstrual", title: "Menstrual Health" },
  { id: "lifestyle", title: "Lifestyle Habits" },
  { id: "health", title: "Health History" },
  { id: "goals", title: "Wellness Goals" },
  { id: "mood", title: "Mood & Energy" },
  { id: "summary", title: "Summary" },
];

const PMS_SYMPTOMS = [
  "Cramps",
  "Headaches",
  "Bloating",
  "Acne",
  "Fatigue",
  "Mood Swings",
  "Breast Tenderness",
  "Insomnia",
  "Cravings",
];

const WELLNESS_GOALS = [
  "Improve sleep quality",
  "Reduce daily stress",
  "Clearer skin",
  "Reduce period pain & cramps",
  "Balance hormones naturally",
  "Boost overall energy",
  "Better nutrition & diet habits",
  "Accurate cycle tracking",
];

const MOODS = [
  "Calm",
  "Happy",
  "Anxious",
  "Tired & Fatigued",
  "Irritable",
  "Sensitive",
  "Focused",
  "Restless",
];

const LOADING_PHASES = [
  "Analyzing your hormonal wellness patterns...",
  "Consulting botanical and lifestyle databases...",
  "Synthesizing your personalized recommendations...",
  "Customizing your CycleWell health dashboard...",
  "Almost ready! Preparing your sanctuary...",
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setStep = useOnboardingStore((state) => state.setStep);
  const updateSection = useOnboardingStore((state) => state.updateSection);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const [answers] = useState(() => useOnboardingStore.getState().answers);

  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cycle through loading texts
  useEffect(() => {
    let interval;
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_PHASES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const { control, handleSubmit, watch, getValues } = useForm({
    defaultValues: answers,
  });

  // Watch form fields of the current section to save progress to Zustand store in real-time
  const currentSection = STEPS[currentStep]?.id;
  const currentSectionValues = watch(currentSection);
  const currentSectionValuesStr = JSON.stringify(currentSectionValues);

  useEffect(() => {
    if (currentSection && currentSectionValues) {
      updateSection(currentSection, currentSectionValues);
    }
  }, [currentSection, currentSectionValuesStr, updateSection]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await api.post("/onboarding", data);
      const { access_token } = response.data;
      const decoded = decodeJwt(access_token);

      if (!decoded) {
        throw new Error("Invalid session token generated.");
      }

      // Update auth store with onboardingCompleted=true user state
      const updatedUser = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        fullName: decoded.fullName || user?.fullName || "",
        phoneNumber: decoded.phoneNumber || "",
        dateOfBirth: decoded.dateOfBirth || null,
        onboardingCompleted: decoded.onboardingCompleted,
      };

      setAuth(updatedUser, access_token);
      resetOnboarding();
      toast.success("AI Profile generated successfully! 🌸");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(
        Array.isArray(msg)
          ? msg.join(". ")
          : msg || "Submission failed. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  // Stepper container animation
  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  if (isSubmitting) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
        style={{ backgroundColor: "#FFF9F7" }}
      >
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-rose-100 border-t-[#F6A58E] animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#F6A58E] animate-pulse" />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingTextIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-serif font-semibold text-[#2D1F1A] max-w-md h-8"
          >
            {LOADING_PHASES[loadingTextIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="mt-4 text-xs font-medium text-[#8C7B74]">
          This takes about 10-15 seconds. Please do not close this window.
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#FFF9F7" }}
    >
      {/* ── HEADER ── */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFF0ED] flex items-center justify-center border border-rose-200">
            <Sparkles size={16} className="text-[#F6A58E]" />
          </div>
          <span className="font-serif font-bold text-xl text-[#2D1F1A]">
            CycleWell
          </span>
        </div>
        {currentStep > 0 && (
          <div className="text-xs font-semibold text-[#8C7B74] bg-[#FFFAF8] border border-rose-100 px-3 py-1.5 rounded-full">
            Step {currentStep} of {STEPS.length - 1}
          </div>
        )}
      </div>

      {/* ── CARD CONTENT ── */}
      <div className="max-w-2xl w-full mx-auto bg-white border border-rose-50 shadow-md rounded-3xl p-6 sm:p-10 flex-1 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#FFF0ED]/40 blur-3xl pointer-events-none" />

        <FormStepWrapper currentStep={currentStep}>
          {/* STEP 0: WELCOME */}
          {currentStep === 0 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center py-6"
            >
              <span className="text-xs uppercase tracking-wider font-bold text-[#F6A58E] bg-[#FFF0ED] px-3 py-1 rounded-full">
                Personalized Onboarding
              </span>
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#2D1F1A] mt-6 leading-tight">
                Welcome to your new hormonal wellness sanctuary 🌸
              </h1>
              <p className="text-[#8C7B74] text-sm mt-4 leading-relaxed max-w-md mx-auto">
                Let's customize your experience. We'll ask you a few questions
                about your menstrual cycle, lifestyle habits, and health history
                so our AI coach can generate your personalized dashboard.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F6A58E] hover:bg-[#F5947A] text-white font-semibold py-3 px-8 rounded-full shadow-sm active:scale-[0.98] transition-all"
                >
                  Begin Journey <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: MENSTRUAL HEALTH */}
          {currentStep === 1 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <Droplets className="text-[#F6A58E]" size={22} />
                  Tell us about your cycle
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  We use these details to calculate cycle phase predictions.
                </p>
              </div>

              {/* Cycle Length */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A] flex justify-between">
                  <span>Average Cycle Length (Days)</span>
                  <span className="text-[#F6A58E]">
                    {watch("menstrualHealth.averageCycleLength")} days
                  </span>
                </label>
                <Controller
                  control={control}
                  name="menstrualHealth.averageCycleLength"
                  render={({ field }) => (
                    <input
                      type="range"
                      min="21"
                      max="45"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full accent-[#F6A58E]"
                    />
                  )}
                />
                <div className="flex justify-between text-[10px] font-bold text-[#8C7B74]/60">
                  <span>21 Days</span>
                  <span>28 Days (Avg)</span>
                  <span>45 Days</span>
                </div>
              </div>

              {/* Last Period Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  When did your last period start?
                </label>
                <Controller
                  control={control}
                  name="menstrualHealth.lastPeriodDate"
                  rules={{ required: "This date is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="relative">
                      <input
                        type="date"
                        {...field}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full bg-[#FFFAF8] border border-rose-100 rounded-2xl h-12 px-4 text-sm text-[#2D1F1A] focus:outline-none focus:ring-2 focus:ring-[#F6A58E]/30"
                      />
                      {error && (
                        <p className="text-red-500 text-[10px] mt-1 font-semibold">
                          {error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* PMS Symptoms */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  What symptoms do you typically experience? (Select all that
                  apply)
                </label>
                <Controller
                  control={control}
                  name="menstrualHealth.pmsSymptoms"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {PMS_SYMPTOMS.map((symptom) => {
                        const isSelected = field.value?.includes(symptom);
                        return (
                          <button
                            key={symptom}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.onChange(
                                  field.value.filter((v) => v !== symptom),
                                );
                              } else {
                                field.onChange([
                                  ...(field.value || []),
                                  symptom,
                                ]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-[#FFF0ED] border-[#F6A58E] text-[#F6A58E]"
                                : "bg-white border-[#8C7B74]/10 text-[#8C7B74]"
                            }`}
                          >
                            {symptom}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Irregular / Pain Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Are your cycles irregular?
                  </label>
                  <Controller
                    control={control}
                    name="menstrualHealth.irregularCycles"
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {[
                          { val: true, label: "Yes" },
                          { val: false, label: "No" },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => field.onChange(opt.val)}
                            className={`flex-1 h-11 rounded-2xl text-xs font-bold transition-all border ${
                              field.value === opt.val
                                ? "bg-[#FFF0ED] border-[#F6A58E] text-[#F6A58E]"
                                : "bg-white border-[#8C7B74]/15 text-[#8C7B74]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Period pain severity:
                  </label>
                  <Controller
                    control={control}
                    name="menstrualHealth.painSeverity"
                    render={({ field }) => (
                      <div className="flex gap-1 bg-[#FFFAF8] border border-rose-100/50 p-1 rounded-2xl h-11">
                        {["None", "Mild", "Moderate", "Severe"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => field.onChange(level)}
                            className={`flex-1 h-full rounded-xl text-[10px] font-extrabold transition-all ${
                              field.value === level
                                ? "bg-[#F6A58E] text-white shadow-sm"
                                : "text-[#8C7B74]"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: LIFESTYLE HABITS */}
          {currentStep === 2 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <Moon className="text-[#8BC0D0]" size={22} />
                  Lifestyle & daily rhythms
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  Sleep, hydration, and movement directly influence cortisol and
                  hormones.
                </p>
              </div>

              {/* Sleep Hours */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A] flex justify-between">
                  <span>How much sleep do you get?</span>
                  <span className="text-[#8BC0D0]">
                    {watch("lifestyle.sleepHours")} hours
                  </span>
                </label>
                <Controller
                  control={control}
                  name="lifestyle.sleepHours"
                  render={({ field }) => (
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="0.5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                      className="w-full accent-[#8BC0D0]"
                    />
                  )}
                />
              </div>

              {/* Water Intake */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A] flex justify-between">
                  <span>Daily Water Intake:</span>
                  <span className="text-[#8BC0D0]">
                    {(watch("lifestyle.waterIntake") / 1000).toFixed(1)}L
                  </span>
                </label>
                <Controller
                  control={control}
                  name="lifestyle.waterIntake"
                  render={({ field }) => (
                    <div className="flex gap-2">
                      {[1000, 1500, 2000, 2500, 3000].map((ml) => (
                        <button
                          key={ml}
                          type="button"
                          onClick={() => field.onChange(ml)}
                          className={`flex-1 h-10 rounded-2xl text-xs font-semibold border transition-all ${
                            field.value === ml
                              ? "bg-[#E6F4F8] border-[#8BC0D0] text-[#8BC0D0]"
                              : "bg-white border-[#8C7B74]/15 text-[#8C7B74]"
                          }`}
                        >
                          {ml / 1000}L
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Stress Level & Activity Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Perceived Stress Level:
                  </label>
                  <Controller
                    control={control}
                    name="lifestyle.stressLevel"
                    render={({ field }) => (
                      <div className="flex gap-1.5 bg-[#FFFAF8] border border-rose-100/50 p-1.5 rounded-2xl h-11">
                        {["low", "medium", "high"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => field.onChange(level)}
                            className={`flex-1 h-full rounded-xl text-xs font-bold capitalize transition-all ${
                              field.value === level
                                ? "bg-[#8BC0D0] text-white shadow-sm"
                                : "text-[#8C7B74]"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Physical Activity Level:
                  </label>
                  <Controller
                    control={control}
                    name="lifestyle.activityLevel"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-[#FFFAF8] border border-rose-100 rounded-2xl h-11 px-4 text-xs font-semibold text-[#8C7B74] focus:outline-none"
                      >
                        <option value="sedentary">
                          Sedentary (No exercise)
                        </option>
                        <option value="lightly_active">Lightly Active</option>
                        <option value="moderately_active">
                          Moderately Active
                        </option>
                        <option value="very_active">
                          Very Active (Daily sports)
                        </option>
                      </select>
                    )}
                  />
                </div>
              </div>

              {/* Screen Time */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A] flex justify-between">
                  <span>Average Daily Screen Time (Hours):</span>
                  <span className="text-[#8BC0D0]">
                    {watch("lifestyle.screenTime")} hours
                  </span>
                </label>
                <Controller
                  control={control}
                  name="lifestyle.screenTime"
                  render={({ field }) => (
                    <input
                      type="range"
                      min="1"
                      max="12"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full accent-[#8BC0D0]"
                    />
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: HEALTH HISTORY */}
          {currentStep === 3 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <Heart className="text-[#F8B6B6]" size={22} />
                  Hormonal Health History
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  Your medical details are confidential and used to customize
                  nutritional recommendations.
                </p>
              </div>

              <div className="space-y-4">
                {/* PCOS / Thyroid / Imbalance */}
                {[
                  {
                    name: "hasPcos",
                    label: "Do you have a history of PCOS?",
                  },
                  {
                    name: "hasThyroid",
                    label: "Do you have diagnosed Thyroid conditions?",
                  },
                  {
                    name: "hasHormonalImbalance",
                    label: "Do you experience general Hormonal Imbalance?",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 border border-rose-100 rounded-2xl bg-[#FFFAF8]/50"
                  >
                    <span className="text-xs font-semibold text-[#2D1F1A]">
                      {item.label}
                    </span>
                    <Controller
                      control={control}
                      name={`healthHistory.${item.name}`}
                      render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className={`w-12 h-7 rounded-full transition-colors relative flex items-center ${
                            field.value ? "bg-[#F8B6B6]" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full bg-white absolute transition-transform ${
                              field.value ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Medications / Supplements */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  List any active medications or supplements (Separated by
                  commas):
                </label>
                <Controller
                  control={control}
                  name="healthHistory.medications"
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="e.g. Magnesium, Zinc, Birth Control, Levothyroxine"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                      className="w-full bg-[#FFFAF8] border border-rose-100 rounded-2xl h-12 px-4 text-sm text-[#2D1F1A] focus:outline-none focus:ring-2 focus:ring-[#F8B6B6]/30"
                    />
                  )}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 4: WELLNESS GOALS */}
          {currentStep === 4 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <Activity className="text-[#8BC0D0]" size={22} />
                  What are your wellness goals?
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  We customize dashboard checklists based on what you select.
                </p>
              </div>

              <Controller
                control={control}
                name="wellnessGoals.goals"
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {WELLNESS_GOALS.map((goal) => {
                      const isSelected = field.value?.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              field.onChange(
                                field.value.filter((v) => v !== goal),
                              );
                            } else {
                              field.onChange([...(field.value || []), goal]);
                            }
                          }}
                          className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-[#E6F4F8] border-[#8BC0D0] text-[#8BC0D0] shadow-sm"
                              : "bg-white border-[#8C7B74]/15 text-[#8C7B74] hover:bg-[#FFFAF8]/50"
                          }`}
                        >
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </motion.div>
          )}

          {/* STEP 5: MOOD & ENERGY */}
          {currentStep === 5 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <Smile className="text-[#F6A58E]" size={22} />
                  Mood patterns & energy levels
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  Help us understand how hormones correlate with your stress and
                  vibe.
                </p>
              </div>

              {/* Moods */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  Select typical moods you notice:
                </label>
                <Controller
                  control={control}
                  name="moodEnergy.moods"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((mood) => {
                        const isSelected = field.value?.includes(mood);
                        return (
                          <button
                            key={mood}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                field.onChange(
                                  field.value.filter((v) => v !== mood),
                                );
                              } else {
                                field.onChange([...(field.value || []), mood]);
                              }
                            }}
                            className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-[#FFF0ED] border-[#F6A58E] text-[#F6A58E]"
                                : "bg-white border-[#8C7B74]/15 text-[#8C7B74]"
                            }`}
                          >
                            {mood}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Energy Level & Anxiety Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Overall Energy level:
                  </label>
                  <Controller
                    control={control}
                    name="moodEnergy.energyLevel"
                    render={({ field }) => (
                      <div className="flex gap-1.5 bg-[#FFFAF8] border border-rose-100/50 p-1.5 rounded-2xl h-11">
                        {["Low", "Medium", "High"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => field.onChange(level)}
                            className={`flex-1 h-full rounded-xl text-xs font-bold transition-all ${
                              field.value === level
                                ? "bg-[#F6A58E] text-white shadow-sm"
                                : "text-[#8C7B74]"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Do you feel anxious?
                  </label>
                  <Controller
                    control={control}
                    name="moodEnergy.anxietyFrequency"
                    render={({ field }) => (
                      <div className="flex gap-1 bg-[#FFFAF8] border border-rose-100/50 p-1 rounded-2xl h-11">
                        {["Never", "Rarely", "Sometimes", "Often"].map(
                          (level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => field.onChange(level)}
                              className={`flex-1 h-full rounded-xl text-[10px] font-extrabold transition-all ${
                                field.value === level
                                  ? "bg-[#F6A58E] text-white shadow-sm"
                                  : "text-[#8C7B74]"
                              }`}
                            >
                              {level}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: SUMMARY & REVIEW */}
          {currentStep === 6 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <CheckCircle className="text-[#8BC0D0]" size={22} />
                  Summary & Final Review
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  Make sure everything looks right before we call your AI
                  wellness coach.
                </p>
              </div>

              <div className="bg-[#FFFAF8] border border-rose-100 rounded-3xl p-5 space-y-4 text-xs font-semibold text-[#8C7B74] max-h-72 overflow-y-auto">
                <div>
                  <h4 className="text-[#2D1F1A] uppercase tracking-wider text-[10px] font-bold border-b pb-1 mb-2">
                    Menstrual Cycle
                  </h4>
                  <p>
                    Average cycle length:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("menstrualHealth.averageCycleLength")} days
                    </span>
                  </p>
                  <p>
                    Last period date:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("menstrualHealth.lastPeriodDate")}
                    </span>
                  </p>
                  <p>
                    Symptoms selected:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("menstrualHealth.pmsSymptoms")?.join(", ") ||
                        "None"}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="text-[#2D1F1A] uppercase tracking-wider text-[10px] font-bold border-b pb-1 mb-2">
                    Lifestyle
                  </h4>
                  <p>
                    Avg sleep:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("lifestyle.sleepHours")} hours
                    </span>
                  </p>
                  <p>
                    Water intake:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("lifestyle.waterIntake") / 1000}L
                    </span>
                  </p>
                  <p>
                    Stress level:{" "}
                    <span className="text-[#2D1F1A] capitalize">
                      {getValues("lifestyle.stressLevel")}
                    </span>
                  </p>
                </div>

                <div>
                  <h4 className="text-[#2D1F1A] uppercase tracking-wider text-[10px] font-bold border-b pb-1 mb-2">
                    Wellness Goals
                  </h4>
                  <p className="text-[#2D1F1A]">
                    {getValues("wellnessGoals.goals")?.join(", ") ||
                      "No goals selected"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </FormStepWrapper>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex justify-between items-center mt-10 border-t border-rose-50 pt-6">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7B74] hover:text-[#2D1F1A] transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 bg-[#FFF0ED] text-[#F6A58E] hover:bg-[#FFE0D9] text-xs font-bold py-2.5 px-5 rounded-full active:scale-[0.98] transition-all border border-[#F6A58E]/10"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="inline-flex items-center gap-2 bg-[#F6A58E] text-white hover:bg-[#F5947A] text-xs font-bold py-2.5 px-6 rounded-full shadow-sm active:scale-[0.98] transition-all"
            >
              Generate AI Profile <Sparkles size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FormStepWrapper({ children, currentStep }) {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <AnimatePresence mode="wait">
        <div key={currentStep} className="w-full">
          {children}
        </div>
      </AnimatePresence>
    </div>
  );
}
