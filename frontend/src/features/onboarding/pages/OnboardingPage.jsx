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
  Calendar,
  Activity,
  User,
  Heart,
  Ruler,
  Scale,
} from "lucide-react";
import { decodeJwt } from "@/utils/jwt";

const STEPS = [
  { id: "basicInfo", title: "Let's get to know you" },
  { id: "cycleTracking", title: "Your cycle basics" },
  { id: "symptomPreferences", title: "What should Nura track for you?" },
  { id: "healthGoals", title: "What are you focusing on?" },
];

// Floating animated background blobs
const BackgroundBlobs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {/* Subtle noise overlay */}
    <div
      className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
    />
    <motion.div
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 20, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-30"
      style={{
        background: "radial-gradient(circle, #F6A58E 0%, transparent 70%)",
      }}
    />
    <motion.div
      animate={{
        x: [0, -60, 40, 0],
        y: [0, 50, -30, 0],
        scale: [1, 0.9, 1.1, 1],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute top-[20%] -right-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"
      style={{
        background: "radial-gradient(circle, #F8B6B6 0%, transparent 70%)",
      }}
    />
    <motion.div
      animate={{
        x: [0, 40, -50, 0],
        y: [0, -30, 60, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-multiply filter blur-[120px] opacity-20"
      style={{
        background: "radial-gradient(circle, #FFF0ED 0%, transparent 70%)",
      }}
    />
  </div>
);

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setAuth } = useAuthStore();
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setStep = useOnboardingStore((state) => state.setStep);
  const updateSection = useOnboardingStore((state) => state.updateSection);
  const resetOnboarding = useOnboardingStore((state) => state.resetOnboarding);
  const answers = useOnboardingStore((state) => state.answers);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, watch, getValues, trigger, setValue } = useForm({
    defaultValues: answers,
  });

  // Pre-fill name from auth context if missing
  useEffect(() => {
    if (user?.fullName && !getValues("basicInfo.fullName")) {
      setValue("basicInfo.fullName", user.fullName);
    }

    // Resume logic based on profileStatus and lastCompletedStep
    if (
      user?.profileStatus === "INCOMPLETE" &&
      typeof user?.lastCompletedStep === "number"
    ) {
      if (user.lastCompletedStep < STEPS.length - 1) {
        setStep(user.lastCompletedStep + 1);
      }
    }
  }, [user, getValues, setValue, setStep]);

  // Watch current section for live store updates
  const currentSection = STEPS[currentStep]?.id;
  const currentSectionValues = watch(currentSection);
  const currentSectionValuesStr = JSON.stringify(currentSectionValues);

  useEffect(() => {
    if (currentSection && currentSectionValues) {
      updateSection(currentSection, currentSectionValues);
    }
  }, [
    currentSection,
    currentSectionValues,
    currentSectionValuesStr,
    updateSection,
  ]);

  const handleNext = async () => {
    let isValid = true;
    if (currentStep === 0) {
      isValid = await trigger([
        "basicInfo.fullName",
        "basicInfo.age",
        "basicInfo.height",
        "basicInfo.weight",
      ]);
    } else if (currentStep === 1) {
      isValid = await trigger(["cycleTracking.lastPeriodDate"]);
    } else if (currentStep === 2) {
      isValid = true;
    } else if (currentStep === 3) {
      isValid = await trigger(["healthGoals.primaryGoal"]);
    }

    if (isValid) {
      // Auto-save step
      try {
        const payload = {
          step: currentStep,
          [currentSection]: getValues(currentSection),
        };
        await api.post("/onboarding/step", payload);
      } catch (err) {
        console.error("Failed to auto-save step", err);
      }

      if (currentStep < STEPS.length - 1) {
        setStep(currentStep + 1);
      } else {
        completeFlow();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const completeFlow = async () => {
    setIsSubmitting(true);
    try {
      // Save last step just in case
      await api.post("/onboarding/step", {
        step: currentStep,
        [currentSection]: getValues(currentSection),
      });

      const response = await api.post("/onboarding/complete");
      const { access_token } = response.data;
      const decoded = decodeJwt(access_token);

      if (!decoded) {
        throw new Error("Invalid session token generated.");
      }

      // Update auth store with onboardingCompleted=true and profileStatus=COMPLETE
      const updatedUser = {
        ...user,
        onboardingCompleted: decoded.onboardingCompleted,
        profileStatus: decoded.profileStatus,
        lastCompletedStep: decoded.lastCompletedStep,
      };

      setAuth(updatedUser, access_token);
      resetOnboarding();
      toast.success("Profile setup complete! Welcome to Nura 🌸");
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
    initial: { opacity: 0, x: 20, scale: 0.98 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, x: -20, scale: 0.98, transition: { duration: 0.3 } },
  };

  if (isSubmitting) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative"
        style={{ backgroundColor: "#FFF9F7" }}
      >
        <BackgroundBlobs />
        <div className="relative z-10 mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-rose-100 border-t-[#F6A58E] animate-spin shadow-[0_0_15px_rgba(246,165,142,0.4)]" />
          <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[#F6A58E] animate-pulse" />
        </div>
        <p className="relative z-10 text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2D1F1A] to-[#8C7B74] max-w-md h-8">
          Preparing your sanctuary...
        </p>
      </div>
    );
  }

  const inputBaseClass =
    "w-full bg-white/60 border border-white/60 rounded-2xl h-14 pl-12 pr-4 text-sm text-[#2D1F1A] placeholder:text-[#8C7B74]/50 focus:outline-none focus:ring-2 focus:ring-[#F6A58E]/40 focus:border-[#F6A58E]/40 transition-all duration-200 focus:scale-[1.01] focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

  return (
    <div
      className="min-h-screen flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundColor: "#FFF9F7",
        backgroundImage: "url('/onboarding-bg.jpg')",
      }}
    >
      <BackgroundBlobs />

      {/* ── HEADER ── */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex items-center justify-between mb-8 sm:mb-12">
        {/* Removed Nura logo as requested */}
        <div></div>

        {/* Animated Progress Indicator */}
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-white/50 px-4 py-2.5 rounded-full shadow-sm">
          {STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                idx === currentStep
                  ? "w-6 bg-[#F6A58E] shadow-[0_0_8px_rgba(246,165,142,0.6)]"
                  : idx < currentStep
                    ? "w-2 bg-[#F6A58E]/40"
                    : "w-2 bg-[#8C7B74]/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── CARD CONTENT ── */}
      <div className="relative z-10 max-w-xl w-full mx-auto flex-1 flex flex-col justify-center">
        {/* Soft ambient glow behind the card */}
        <div className="absolute inset-0 bg-[#F6A58E]/5 blur-[80px] rounded-[40px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(140,123,116,0.08)] rounded-[32px] p-6 sm:p-10 flex flex-col relative overflow-hidden transition-transform duration-500 hover:-translate-y-1"
        >
          {/* Card breathing animation (subtle) */}
          <motion.div
            animate={{ scale: [1, 1.005, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none rounded-[32px] border border-[#F6A58E]/10"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 w-full relative z-10"
            >
              <div>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-br from-[#2D1F1A] to-[#8C7B74] flex items-center gap-3">
                  <div className="p-2 bg-white/80 rounded-2xl shadow-sm border border-white">
                    {currentStep === 0 && (
                      <User className="text-[#F6A58E]" size={24} />
                    )}
                    {currentStep === 1 && (
                      <Calendar className="text-[#F6A58E]" size={24} />
                    )}
                    {currentStep === 2 && (
                      <Activity className="text-[#F6A58E]" size={24} />
                    )}
                    {currentStep === 3 && (
                      <Heart className="text-[#F6A58E]" size={24} />
                    )}
                  </div>
                  {STEPS[currentStep].title}
                </h2>
              </div>

              {/* STEP 0: BASIC INFO */}
              {currentStep === 0 && (
                <div className="space-y-6 mt-8">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-wide text-[#8C7B74] uppercase ml-1">
                      Your Name
                    </label>
                    <Controller
                      control={control}
                      name="basicInfo.fullName"
                      rules={{ required: "Name is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="relative">
                          <User
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F6A58E]/70"
                            size={20}
                          />
                          <input
                            type="text"
                            placeholder="Jane Doe"
                            {...field}
                            className={inputBaseClass}
                          />
                          {error && (
                            <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-semibold">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold tracking-wide text-[#8C7B74] uppercase ml-1">
                        Age{" "}
                        <span className="text-[#8C7B74]/50 font-normal lowercase">
                          (opt)
                        </span>
                      </label>
                      <Controller
                        control={control}
                        name="basicInfo.age"
                        render={({ field }) => (
                          <div className="relative">
                            <Calendar
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F6A58E]/70"
                              size={18}
                            />
                            <input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || "")
                              }
                              className={inputBaseClass}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold tracking-wide text-[#8C7B74] uppercase ml-1">
                        Height{" "}
                        <span className="text-[#8C7B74]/50 font-normal lowercase">
                          (cm)
                        </span>
                      </label>
                      <Controller
                        control={control}
                        name="basicInfo.height"
                        render={({ field }) => (
                          <div className="relative">
                            <Ruler
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F6A58E]/70"
                              size={18}
                            />
                            <input
                              type="number"
                              placeholder="165"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || "")
                              }
                              className={inputBaseClass}
                            />
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold tracking-wide text-[#8C7B74] uppercase ml-1">
                        Weight{" "}
                        <span className="text-[#8C7B74]/50 font-normal lowercase">
                          (kg)
                        </span>
                      </label>
                      <Controller
                        control={control}
                        name="basicInfo.weight"
                        render={({ field }) => (
                          <div className="relative">
                            <Scale
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F6A58E]/70"
                              size={18}
                            />
                            <input
                              type="number"
                              placeholder="60"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || "")
                              }
                              className={inputBaseClass}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: CYCLE TRACKING */}
              {currentStep === 1 && (
                <div className="space-y-8 mt-8">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-[#2D1F1A] ml-1">
                      First day of your last period?
                    </label>
                    <Controller
                      control={control}
                      name="cycleTracking.lastPeriodDate"
                      rules={{ required: "This date is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="relative">
                          <Calendar
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F6A58E]/70"
                            size={20}
                          />
                          <input
                            type="date"
                            {...field}
                            max={new Date().toISOString().split("T")[0]}
                            className={inputBaseClass}
                          />
                          {error && (
                            <p className="text-red-500 text-[10px] mt-1.5 ml-1 font-semibold">
                              {error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  <div className="space-y-4 bg-white/50 p-5 rounded-3xl border border-white/60">
                    <label className="text-sm font-semibold text-[#2D1F1A] flex justify-between">
                      <span>Average cycle length</span>
                      <span className="text-[#F6A58E] font-bold bg-white px-3 py-1 rounded-full text-xs shadow-sm">
                        {watch("cycleTracking.averageCycleLength")} days
                      </span>
                    </label>
                    <Controller
                      control={control}
                      name="cycleTracking.averageCycleLength"
                      render={({ field }) => (
                        <input
                          type="range"
                          min="21"
                          max="45"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                          className="w-full accent-[#F6A58E] h-2 bg-rose-100 rounded-lg appearance-none cursor-pointer"
                        />
                      )}
                    />
                    <div className="flex justify-between text-xs font-semibold text-[#8C7B74]/60">
                      <span>21 Days</span>
                      <span>28 Days</span>
                      <span>45 Days</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: SYMPTOM PREFERENCES */}
              {currentStep === 2 && (
                <div className="space-y-4 mt-8">
                  {[
                    {
                      name: "trackCramps",
                      label: "Cramps severity tracking",
                      icon: <Activity size={18} />,
                    },
                    {
                      name: "trackMood",
                      label: "Mood & emotional tracking",
                      icon: <Heart size={18} />,
                    },
                    {
                      name: "trackEnergy",
                      label: "Daily energy levels",
                      icon: <Sparkles size={18} />,
                    },
                    {
                      name: "trackBloating",
                      label: "Bloating & digestion",
                      icon: <Scale size={18} />,
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="group flex items-center gap-4 p-4 sm:p-5 border border-white/60 rounded-2xl bg-white/40 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] hover:shadow-md hover:shadow-[#F6A58E]/5 hover:-translate-y-0.5"
                      onClick={() => {
                        const current = getValues(
                          `symptomPreferences.${item.name}`,
                        );
                        setValue(`symptomPreferences.${item.name}`, !current, {
                          shouldDirty: true,
                        });
                      }}
                    >
                      <Controller
                        control={control}
                        name={`symptomPreferences.${item.name}`}
                        render={({ field }) => (
                          <div
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${field.value ? "bg-[#F6A58E] border-[#F6A58E] scale-110 shadow-sm shadow-[#F6A58E]/40" : "bg-white border-rose-200 group-hover:border-[#F6A58E]/50"}`}
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                scale: field.value ? 1 : 0,
                                opacity: field.value ? 1 : 0,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                            >
                              <Sparkles size={12} className="text-white" />
                            </motion.div>
                          </div>
                        )}
                      />
                      <div className="flex items-center gap-3 text-sm font-semibold text-[#2D1F1A] select-none">
                        <span className="text-[#8C7B74] group-hover:text-[#F6A58E] transition-colors">
                          {item.icon}
                        </span>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 3: HEALTH GOALS */}
              {currentStep === 3 && (
                <div className="space-y-4 mt-8">
                  <Controller
                    control={control}
                    name="healthGoals.primaryGoal"
                    rules={{ required: "Please select a primary focus" }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="space-y-3 sm:space-y-4">
                        {[
                          "Cycle tracking only",
                          "Pain & symptom management",
                          "Fitness alignment with cycle",
                          "Pregnancy planning (optional)",
                        ].map((goal) => (
                          <div
                            key={goal}
                            onClick={() => field.onChange(goal)}
                            className={`p-4 sm:p-5 border rounded-2xl cursor-pointer transition-all duration-300 flex items-center justify-between ${field.value === goal ? "border-[#F6A58E] bg-[#FFF0ED]/80 shadow-[0_4px_12px_rgba(246,165,142,0.15)] -translate-y-0.5" : "border-white/60 bg-white/40 hover:bg-white/80 hover:border-[#F6A58E]/40"}`}
                          >
                            <span
                              className={`text-sm font-bold ${field.value === goal ? "text-[#F6A58E]" : "text-[#2D1F1A]"}`}
                            >
                              {goal}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${field.value === goal ? "border-[#F6A58E]" : "border-rose-200"}`}
                            >
                              <motion.div
                                initial={false}
                                animate={{
                                  scale: field.value === goal ? 1 : 0,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                                className="w-2.5 h-2.5 rounded-full bg-[#F6A58E]"
                              />
                            </div>
                          </div>
                        ))}
                        {error && (
                          <p className="text-red-500 text-[10px] mt-2 ml-1 font-semibold">
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ── FOOTER ACTIONS (INSIDE CARD NOW FOR CLEANER LOOK) ── */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#8C7B74]/10 relative z-10">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#8C7B74] hover:text-[#2D1F1A] transition-colors py-2 px-3 -ml-3 rounded-xl hover:bg-white/50"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />{" "}
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="group relative inline-flex items-center gap-2 overflow-hidden bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] text-white hover:shadow-[0_8px_20px_rgba(246,165,142,0.3)] hover:-translate-y-0.5 text-sm font-bold py-3.5 px-8 rounded-full shadow-sm active:scale-[0.97] transition-all duration-300"
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />

              <span className="relative z-10 flex items-center gap-2">
                {currentStep < STEPS.length - 1 ? (
                  <>
                    Continue{" "}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                ) : (
                  <>
                    Finish Setup{" "}
                    <Sparkles size={16} className="animate-pulse" />
                  </>
                )}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
