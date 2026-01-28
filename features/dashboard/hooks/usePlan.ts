import { useContext } from "react";
import { PlanContext } from "../contexts/PlanContext";

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan needs to be inside the provider");
  }

  return context;
};
