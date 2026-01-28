export const getPriorityColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-green-500";
    case "medium":
      return "bg-yellow-500";
    case "high":
      return "bg-red-500";
    default:
      return "bg-yellow-500";
  }
};
