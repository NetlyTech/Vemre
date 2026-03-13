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
}

export default AdminQueries
