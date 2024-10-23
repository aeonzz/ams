import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type {
  DepartmentWithRelations,
  SupplyItemWithRelations,
} from "prisma/generated/zod";
import { useSupplyItemCategory } from "./use-supply-item-category";

type SupplyItemData = {
  items: SupplyItemWithRelations[];
  departments: DepartmentWithRelations[];
};

export function useSupplyResourceData() {
  const {
    data: supplyData,
    isLoading: isSupplyDataLoading,
    isError: isErrorSupplyData,
    refetch: refetchSupplyData,
  } = useQuery<SupplyItemData>({
    queryKey: ["get-input-supply-resource"],
    queryFn: async () => {
      const response = await axios.get("/api/input-data/resource-items/supply");
      return response.data.data;
    },
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isErrorCategories,
  } = useSupplyItemCategory();

  return {
    supplyData,
    isSupplyDataLoading,
    isErrorSupplyData,
    refetchSupplyData,
    categories,
    isCategoriesLoading,
    isErrorCategories,
  };
}
