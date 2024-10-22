import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { SupplyItemCategory } from "prisma/generated/zod";

export const useSupplyItemCategory = () => {
  return useQuery<SupplyItemCategory[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/supply-category");
      return res.data.data;
    },
    queryKey: ["get-supply-item-category"],
  });
};
