import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DEFAULT_ANSWERS = {
  personalDetails: {
    fullName: "",
    age: "",
    height: "",
    weight: "",
    dateOfBirth: "",
    phoneNumber: "",
  },
  menstrualHealth: {
    lastPeriodDate: "",
    averageCycleLength: 28,
    pmsSymptoms: [],
    irregularCycles: false,
    painSeverity: "None",
  },
  lifestyle: {
    sleepHours: 7,
    waterIntake: 2000,
    activityLevel: "sedentary",
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
    anxietyFrequency: "Never",
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
