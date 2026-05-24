import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_ANSWERS = {
  personalDetails: {
    dateOfBirth: "",
    phoneNumber: "",
  },
  menstrualHealth: {
    averageCycleLength: 28,
    lastPeriodDate: "",
    pmsSymptoms: [],
    irregularCycles: false,
    painSeverity: "Moderate",
  },
  lifestyle: {
    sleepHours: 8,
    waterIntake: 2000,
    activityLevel: "moderately_active",
    stressLevel: "medium",
    screenTime: 4,
  },
  healthHistory: {
    hasPcos: false,
    hasThyroid: false,
    hasHormonalImbalance: false,
    medications: [],
  },
  wellnessGoals: {
    goals: [],
  },
  moodEnergy: {
    moods: [],
    energyLevel: "Medium",
    anxietyFrequency: "Sometimes",
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
