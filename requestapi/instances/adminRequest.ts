import rootAxiosInstance from "../axiosinstance"

export type AdminRecord = {
  _id: string
  fullname?: string
  email: string
  role: "international" | "local"
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

class AdminServices {
  async getAllAdmins(): Promise<{ data: AdminRecord[] }> {
    const response = await rootAxiosInstance.get("/api/admin/all")
    return response.data
  }

  async getSingleAdmin(id: string): Promise<{ data: AdminRecord }> {
    const response = await rootAxiosInstance.get(`/api/admin/${id}`)
    return response.data
  }

  async createAdmin(data: {
    fullname: string
    email: string
    password: string
    role: "international" | "local"
  }): Promise<{ data: AdminRecord }> {
    const response = await rootAxiosInstance.post("/api/admin/create", data)
    return response.data
  }

  async deleteAdmin(id: string): Promise<{ message: string }> {
    const response = await rootAxiosInstance.delete(`/api/admin/${id}`)
    return response.data
  }
}

export default AdminServices
