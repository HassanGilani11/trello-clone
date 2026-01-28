"use client";

import { createContext } from "react";

interface PlanContextType {
  isFreeUser: boolean;
  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
}

export const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: React.ReactNode;
  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
}

export function PlanProvider({
  children,
  hasProPlan,
  hasEnterprisePlan,
}: PlanProviderProps) {
  return (
    <PlanContext.Provider
      value={{
        hasProPlan,
        hasEnterprisePlan,
        isFreeUser: !hasProPlan && !hasEnterprisePlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}
