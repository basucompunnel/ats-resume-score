"use client";

import { useState, useEffect, useCallback } from "react";

interface ComparisonData {
  resume1: string;
  resume2: string;
  resume3: string;
  jobDescription: string;
}

const STORAGE_KEY = "ats_comparison_data";

export function useComparisonStorage() {
  const [data, setData] = useState<ComparisonData>({
    resume1: "",
    resume2: "",
    resume3: "",
    jobDescription: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);
      } catch (error) {
        console.error("Failed to parse stored comparison data:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  const saveData = useCallback(
    (newData: Partial<ComparisonData>) => {
      const updated = { ...data, ...newData };
      setData(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [data]
  );

  // Update individual fields
  const updateResume = useCallback(
    (index: 1 | 2 | 3, text: string) => {
      saveData({ [`resume${index}`]: text } as Partial<ComparisonData>);
    },
    [saveData]
  );

  const updateJobDescription = useCallback(
    (text: string) => {
      saveData({ jobDescription: text });
    },
    [saveData]
  );

  // Clear all data
  const clearAll = useCallback(() => {
    const cleared: ComparisonData = {
      resume1: "",
      resume2: "",
      resume3: "",
      jobDescription: "",
    };
    setData(cleared);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    isLoaded,
    updateResume,
    updateJobDescription,
    clearAll,
  };
}
