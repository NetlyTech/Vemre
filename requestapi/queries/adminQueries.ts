import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AdminServices from "../instances/adminRequest"

const adminServices = new AdminServices()

class AdminQueries {
  useAllAdmins = () => {
    return useQuery({
      queryKey: ["admins"],
      queryFn: () => adminServices.getAllAdmins(),
    })
  }

  useCreateAdmin = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: {
        fullname: string
        email: string
        password: string
        role: "international" | "local"
      }) => adminServices.createAdmin(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admins"] })
      },
    })
  }

  useDeleteAdmin = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => adminServices.deleteAdmin(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admins"] })
      },
    })
  }

  useAdminNotifications = () => {
    return useQuery({
      queryKey: ["adminNotifications"],
      queryFn: () => adminServices.getNotifications(),
      refetchInterval: 30_000,
    })
  }

  useMarkNotificationsRead = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: () => adminServices.markNotificationsRead(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminNotifications"] })
      },
    })
  }

  useDeletedUsers = () => {
    return useQuery({
      queryKey: ["deletedUsers"],
      queryFn: () => adminServices.getDeletedUsers(),
    })
  }

  useDashboard = () => {
    return useQuery({
      queryKey: ["adminDashboard"],
      queryFn: () => adminServices.getDashboard(),
      refetchInterval: 60_000,
    })
  }

  useRevenueByMonth = () => {
    return useQuery({
      queryKey: ["adminRevenue"],
      queryFn: () => adminServices.getRevenueByMonth(),
      refetchInterval: 60_000,
    })
  }

  useCurrentFxRate = () => {
    return useQuery({
      queryKey: ["currentFxRate"],
      queryFn: () => adminServices.getCurrentFxRate(),
      refetchInterval: 60_000,
    })
  }
}

export default AdminQueries
