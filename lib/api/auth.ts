import axios from "@/requestapi/axiosinstance"

export const adminLogin = async (data:any) => {
  const res = await axios.post("/api/auth/adminlogin", data)
  return res.data
}