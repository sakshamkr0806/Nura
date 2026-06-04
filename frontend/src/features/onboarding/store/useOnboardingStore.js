import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_ANSWERS = {
  basicInfo: {
    fullName: "",
    age: "",
    height: "",
    weight: "",
  },
  cycleTracking: {
    lastPeriodDate: "",
    averageCycleLength: 28,
  },
  symptomPreferences: {
    trackCramps: false,
    trackMood: false,
    trackEnergy: false,
    trackBloating: false,
  },
  healthGoals: {
    primaryGoal: "",
  },
};

export const useOnboardingStore = create()(
  persist(
    (set) => ({
      answers: DEFAULT_ANSWERS,
      currentStep: 0,
      setStep: (step) => set({ currentStep: step }),
      updateSection: (section, data) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [section]: {
              ...state.answers[section],
              ...data,
            },
          },
        })),
      resetOnboarding: () => set({ answers: DEFAULT_ANSWERS, currentStep: 0 }),
    }),
    {
      name: "onboarding-storage",
    },
  ),
);
