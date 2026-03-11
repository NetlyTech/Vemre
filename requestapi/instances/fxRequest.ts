import rootAxiosInstance from "../axiosinstance";

export type FxRate = {
  _id?: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  createdAt?: string;
  updatedAt?: string;
};

class FxServices {
  async getCurrentRate(baseCurrency: string, targetCurrency: string): Promise<{ data: FxRate[] }> {
    const response = await rootAxiosInstance.get("/api/fx/current", {
      params: { baseCurrency, targetCurrency },
    });
    return response.data;
  }

  async getRateHistory(baseCurrency: string, targetCurrency: string): Promise<{ data: FxRate[] }> {
    const response = await rootAxiosInstance.get("/api/fx/history", {
      params: { baseCurrency, targetCurrency },
    });
    return response.data;
  }

  async updateRate(data: { baseCurrency: string; targetCurrency: string; rate: number }) {
    const response = await rootAxiosInstance.post("/api/fx/update", data);
    return response.data;
  }
}

export default FxServices;
