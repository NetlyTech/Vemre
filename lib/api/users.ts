import axios from "@/requestapi/axiosinstance"

export const getUsers = async () => {
  const res = await axios.get("/api/admin/users")
  return res.data
}