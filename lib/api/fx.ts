import axios from "@/requestapi/axiosinstance"

export const getFxRates = async () => {
  const res = await axios.get("/api/fx/current")
  return res.data
}

export const updateFxRate = async (data:any) => {
  const res = await axios.post("/api/fx/update", data)
  return res.data
}