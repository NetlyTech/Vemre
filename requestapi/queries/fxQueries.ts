import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FxServices from "../instances/fxRequest";

const fxServices = new FxServices();

class FxQueries {
  useCurrentRate = (baseCurrency: string, targetCurrency: string) => {
    return useQuery({
      queryKey: ["fx-current", baseCurrency, targetCurrency],
      queryFn: () => fxServices.getCurrentRate(baseCurrency, targetCurrency),
      enabled: !!baseCurrency && !!targetCurrency,
      select: (res) => res.data[0] ?? null,
    });
  };

  useRateHistory = (baseCurrency: string, targetCurrency: string) => {
    return useQuery({
      queryKey: ["fx-history", baseCurrency, targetCurrency],
      queryFn: () => fxServices.getRateHistory(baseCurrency, targetCurrency),
      enabled: !!baseCurrency && !!targetCurrency,
    });
  };

  useUpdateRate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: { baseCurrency: string; targetCurrency: string; rate: number }) =>
        fxServices.updateRate(data),
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["fx-current", variables.baseCurrency, variables.targetCurrency],
        });
        queryClient.invalidateQueries({
          queryKey: ["fx-history", variables.baseCurrency, variables.targetCurrency],
        });
      },
    });
  };
}

export default FxQueries;
