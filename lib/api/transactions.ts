import axios from "@/requestapi/axiosinstance"

export const getTransactions = async () => {
  const res = await axios.get("/api/admin/transactions")
  return res.data
}