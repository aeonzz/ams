import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateQuery() {
  const qc = useQueryClient();

  qc.invalidateQueries({ queryKey: ["pending-req-overview"] });
  qc.invalidateQueries({ queryKey: ["total-req-overview"] });
  qc.invalidateQueries({ queryKey: ["pending-req"] });
}
