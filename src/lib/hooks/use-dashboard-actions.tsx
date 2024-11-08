import create from "zustand";
import { DateRange } from "react-day-picker";
import { RequestTypeType } from "prisma/generated/zod/inputTypeSchemas/RequestTypeSchema";

type TimeRange = "day" | "week" | "month";

interface DashboardActionsState {
  isGenerating: boolean;
  timeRange: TimeRange;
  requestType: RequestTypeType | "";
  date: DateRange | undefined;
  setIsGenerating: (value: boolean) => void;
  setTimeRange: (range: TimeRange) => void;
  setRequestType: (type: RequestTypeType | "") => void;
  setDate: (range: DateRange | undefined) => void;
  reset: () => void;
}

export const useDashboardActions = create<DashboardActionsState>((set) => ({
  isGenerating: false,
  timeRange: "day",
  requestType: "",
  date: undefined,
  setIsGenerating: (value) => set({ isGenerating: value }),
  setTimeRange: (range) => set({ timeRange: range }),
  setRequestType: (type) => set({ requestType: type }),
  setDate: (range) => set({ date: range }),
  reset: () =>
    set({
      isGenerating: false,
      timeRange: "day",
      requestType: "",
      date: undefined,
    }),
}));
