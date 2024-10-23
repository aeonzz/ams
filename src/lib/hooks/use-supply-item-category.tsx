import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { SupplyItemCategoryWithRelations } from "prisma/generated/zod";

export const useSupplyItemCategory = () => {
  return useQuery<SupplyItemCategoryWithRelations[]>({
    queryFn: async () => {
      const res = await axios.get("/api/input-data/supply-category");
      return res.data.data;
    },
    queryKey: ["get-supply-item-category"],
  });
};
