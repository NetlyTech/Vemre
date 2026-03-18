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

export type AdminNotificationRecord = {
  _id: string
  message: string
  type: "payment" | "kyc" | "user" | "general"
  isReaded: boolean
  createdAt: string
}

export type DeletedUserRecord = {
  _id: string
  fullname?: string
  email: string
  isDeleted: boolean
  updatedAt?: string
  createdAt?: string
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

  async getNotifications(): Promise<{ data: AdminNotificationRecord[] }> {
    const response = await rootAxiosInstance.get("/api/admin/notifications")
    return response.data
  }

  async markNotificationsRead(): Promise<{ message: string }> {
    const response = await rootAxiosInstance.post("/api/admin/notifications/read")
    return response.data
  }

  async getDeletedUsers(): Promise<{ data: DeletedUserRecord[] }> {
    const response = await rootAxiosInstance.get("/api/admin/users/deleted")
    return response.data
  }
}

export default AdminServices
