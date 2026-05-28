import { useState, useEffect, useCallback } from "react";
import api from "@/api/axios";

/**
 * Shared hook for fetching cycle data (periods, predictions, logged days).
 * Used by Dashboard and Calendar pages to avoid duplicate fetch logic.
 */
export function useCycleData() {
  const [highlightedDates, setHighlightedDates] = useState({
    period: [],
    prediction: [],
    logged: [],
  });
  const [cycles, setCycles] = useState([]);
  const [predictions, setPredictions] = useState(null);

  const fetchCycleData = useCallback(async () => {
    try {
      const currentYear = new Date().getFullYear();
      const [cyclesRes, predictionsRes, logsRes] = await Promise.all([
        api.get("/cycles"),
        api.get("/cycles/predictions"),
        api.get(
          `/logs/range?start=${currentYear - 2}-01-01&end=${currentYear + 2}-12-31`,
        ),
      ]);

      const periods = [];
      cyclesRes.data.forEach((cycle) => {
        const start = new Date(cycle.startDate);
        const end = cycle.endDate ? new Date(cycle.endDate) : new Date();
        let current = new Date(start);
        while (current <= end) {
          periods.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });

      const predictions = [];
      if (predictionsRes.data?.predictedNextPeriod) {
        const predStart = new Date(predictionsRes.data.predictedNextPeriod);
        for (let i = 0; i < 5; i++) {
          const d = new Date(predStart);
          d.setDate(d.getDate() + i);
          predictions.push(d);
        }
      }

      const logged = [];
      logsRes.data?.forEach((log) => {
        const d = new Date(log.date);
        logged.push(d);
        if (log.symptoms?.includes("Period Day")) periods.push(d);
        if (log.symptoms?.includes("Predicted Period")) predictions.push(d);
      });

      setCycles(cyclesRes.data || []);
      setPredictions(predictionsRes.data || null);
      setHighlightedDates({ period: periods, prediction: predictions, logged });
    } catch {
      // Silently handle — calendar will just show no highlights
    }
  }, []);

  useEffect(() => {
    fetchCycleData();
  }, [fetchCycleData]);

  return {
    highlightedDates,
    cycles,
    predictions,
    refetchCycleData: fetchCycleData,
  };
}
