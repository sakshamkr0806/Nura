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
  User,
} from "lucide-react";
import { decodeJwt } from "@/utils/jwt";
import { DateOfBirthPicker } from "@/components/ui/date-of-birth-picker";
import { PhoneInput } from "@/components/ui/phone-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { isAfter, subYears } from "date-fns";

const STEPS = [
  { id: "personalDetails", title: "Personal Details" },
  { id: "personalDetails", title: "Date of Birth & Phone" },
  { id: "menstrualHealth", title: "Menstrual Cycle Info" },
  { id: "menstrualHealth", title: "Symptoms Selection" },
  { id: "lifestyle", title: "Lifestyle Habits" },
  { id: "lifestyle", title: "Stress Level" },
  { id: "summary", title: "Summary & Review" },
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

  const { control, handleSubmit, watch, getValues, trigger } = useForm({
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

  const handleNext = async () => {
    let isValid = true;
    if (currentStep === 0) {
      isValid = await trigger([
        "personalDetails.fullName",
        "personalDetails.age",
        "personalDetails.height",
        "personalDetails.weight",
      ]);
    } else if (currentStep === 1) {
      isValid = await trigger([
        "personalDetails.dateOfBirth",
        "personalDetails.phoneNumber",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger(["menstrualHealth.lastPeriodDate"]);
    }
    if (isValid && currentStep < STEPS.length - 1) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return; // Prevent duplicate submissions

    if (!data.personalDetails?.fullName) {
      toast.error("Please provide your Name.");
      setStep(0);
      return;
    }
    if (!data.personalDetails?.dateOfBirth) {
      toast.error("Please provide your Date of Birth.");
      setStep(1);
      return;
    }
    if (!data.menstrualHealth?.lastPeriodDate) {
      toast.error("Please provide your Last Period Date.");
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      // Set 15-second timeout on the onboarding API call
      const response = await api.post("/onboarding", data, { timeout: 15000 });
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
      console.error("Onboarding submission error:", err);
      const isTimeout =
        err.code === "ECONNABORTED" ||
        err.message?.toLowerCase().includes("timeout") ||
        err.response?.status === 408;

      if (isTimeout) {
        toast.success("Profile created! AI insights will load shortly. 🌸");
        try {
          // Attempt to refresh the tokens since onboarding completed flag has been updated in the DB
          const refreshResponse = await api.post("/auth/refresh");
          const { access_token } = refreshResponse.data;
          const decoded = decodeJwt(access_token);
          if (decoded) {
            const updatedUser = {
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
              fullName: decoded.fullName || user?.fullName || "",
              phoneNumber: decoded.phoneNumber || "",
              dateOfBirth: decoded.dateOfBirth || null,
              onboardingCompleted: true,
            };
            setAuth(updatedUser, access_token);
            resetOnboarding();
            navigate("/dashboard");
            return;
          }
        } catch (refreshErr) {
          console.error(
            "Token refresh failed during timeout recovery:",
            refreshErr,
          );
        }

        // Last-resort fallback: update auth store manually and redirect
        if (user) {
          const updatedUser = {
            ...user,
            onboardingCompleted: true,
          };
          // Try to use existing token or just update user state
          const token = useAuthStore.getState().accessToken;
          setAuth(updatedUser, token);
        }
        resetOnboarding();
        navigate("/dashboard");
        return;
      }

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
        <div className="text-xs font-semibold text-[#8C7B74] bg-[#FFFAF8] border border-rose-100 px-3 py-1.5 rounded-full">
          Step {currentStep + 1} of {STEPS.length}
        </div>
      </div>

      {/* ── CARD CONTENT ── */}
      <div className="max-w-2xl w-full mx-auto bg-white border border-rose-50 shadow-md rounded-3xl p-6 sm:p-10 flex-1 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#FFF0ED]/40 blur-3xl pointer-events-none" />

        <FormStepWrapper currentStep={currentStep}>
          {/* STEP 1: PERSONAL DETAILS */}
          {currentStep === 0 && (
            <motion.div
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D1F1A] flex items-center gap-2">
                  <User className="text-[#F6A58E]" size={22} /> Tell us about
                  yourself
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  We use your details to customize predictions and insights.
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  Your Name
                </label>
                <Controller
                  control={control}
                  name="personalDetails.fullName"
                  rules={{ required: "Name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        {...field}
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

              {/* Age, Height, Weight in a grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Age (Years)
                  </label>
                  <Controller
                    control={control}
                    name="personalDetails.age"
                    rules={{
                      required: "Required",
                      min: { value: 13, message: "Min 13" },
                      max: { value: 120, message: "Max 120" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          type="number"
                          placeholder="25"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : parseInt(e.target.value),
                            )
                          }
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

                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Height (cm)
                  </label>
                  <Controller
                    control={control}
                    name="personalDetails.height"
                    rules={{
                      required: "Required",
                      min: { value: 50, message: "Min 50cm" },
                      max: { value: 250, message: "Max 250cm" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          type="number"
                          placeholder="165"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : parseFloat(e.target.value),
                            )
                          }
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

                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-semibold text-[#2D1F1A]">
                    Weight (kg)
                  </label>
                  <Controller
                    control={control}
                    name="personalDetails.weight"
                    rules={{
                      required: "Required",
                      min: { value: 20, message: "Min 20kg" },
                      max: { value: 300, message: "Max 300kg" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          type="number"
                          placeholder="60"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : parseFloat(e.target.value),
                            )
                          }
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
              </div>
            </motion.div>
          )}

          {/* STEP 2: DATE OF BIRTH + PHONE NUMBER */}
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
                  <Heart className="text-[#F6A58E]" size={22} /> Date of birth &
                  contact
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  We use your age to tailor physiological predictions.
                </p>
              </div>

              {/* Date of Birth Picker */}
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  Date of Birth
                </label>
                <Controller
                  control={control}
                  name="personalDetails.dateOfBirth"
                  rules={{
                    required: "Date of birth is required",
                    validate: (val) => {
                      if (!val) return "Date of birth is required";
                      const date = new Date(val);
                      if (isNaN(date.getTime())) return "Invalid date format";
                      if (isAfter(date, new Date())) {
                        return "Date of birth cannot be in the future";
                      }
                      const today = new Date();
                      const minAgeDate = subYears(today, 13);
                      if (date > minAgeDate) {
                        return "You must be at least 13 years old to use Nura";
                      }
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <DateOfBirthPicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        error={error}
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

              {/* Phone Input */}
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-semibold text-[#2D1F1A]">
                  Phone Number{" "}
                  <span
                    className="normal-case font-normal text-xs"
                    style={{ color: "#8C7B74" }}
                  >
                    (optional)
                  </span>
                </label>
                <Controller
                  control={control}
                  name="personalDetails.phoneNumber"
                  rules={{
                    validate: (val) => {
                      if (!val || val.trim() === "") return true;
                      const trimmed = val.trim();
                      const isJustCountryCode = /^\+[1-9]\d{0,2}$/.test(
                        trimmed,
                      );
                      if (isJustCountryCode) return true;
                      const isValid =
                        isValidPhoneNumber(trimmed) &&
                        /^\+[1-9]\d{6,14}$/.test(trimmed);
                      return (
                        isValid ||
                        "Invalid phone number format (e.g. +919876543210)"
                      );
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div className="flex flex-col gap-1 w-full">
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        error={error}
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
            </motion.div>
          )}

          {/* STEP 3: MENSTRUAL CYCLE INFO */}
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
            </motion.div>
          )}

          {/* STEP 4: SYMPTOMS SELECTION */}
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
                  <Activity className="text-[#F6A58E]" size={22} />
                  Symptoms selection
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  What symptoms do you typically experience? (Select all that
                  apply)
                </p>
              </div>

              {/* PMS Symptoms */}
              <div className="space-y-2">
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
            </motion.div>
          )}

          {/* STEP 5: LIFESTYLE */}
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
                  <Moon className="text-[#8BC0D0]" size={22} />
                  Lifestyle details
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  Sleep and hydration habits help us customize your plan.
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
            </motion.div>
          )}

          {/* STEP 6: STRESS LEVEL */}
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
                  Stress level
                </h2>
                <p className="text-[#8C7B74] text-xs mt-1">
                  How would you rate your typical stress level?
                </p>
              </div>

              {/* Stress Level */}
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="lifestyle.stressLevel"
                  render={({ field }) => (
                    <div className="flex gap-2 bg-[#FFFAF8] border border-rose-100/50 p-2 rounded-2xl h-14">
                      {["low", "medium", "high"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => field.onChange(level)}
                          className={`flex-1 h-full rounded-xl text-sm font-bold capitalize transition-all ${
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
            </motion.div>
          )}

          {/* STEP 7: SUMMARY & REVIEW */}
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
                    Personal Details
                  </h4>
                  <p>
                    Name:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("personalDetails.fullName") || "Not set"}
                    </span>
                  </p>
                  <p>
                    Age:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("personalDetails.age") || "Not set"}
                    </span>
                  </p>
                  <p>
                    Height:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("personalDetails.height")
                        ? `${getValues("personalDetails.height")} cm`
                        : "Not set"}
                    </span>
                  </p>
                  <p>
                    Weight:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("personalDetails.weight")
                        ? `${getValues("personalDetails.weight")} kg`
                        : "Not set"}
                    </span>
                  </p>
                  <p>
                    Date of Birth:{" "}
                    <span className="text-[#2D1F1A]">
                      {getValues("personalDetails.dateOfBirth")
                        ? new Date(
                            getValues("personalDetails.dateOfBirth"),
                          ).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </p>
                  {getValues("personalDetails.phoneNumber") && (
                    <p>
                      Phone Number:{" "}
                      <span className="text-[#2D1F1A]">
                        {getValues("personalDetails.phoneNumber")}
                      </span>
                    </p>
                  )}
                </div>

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
