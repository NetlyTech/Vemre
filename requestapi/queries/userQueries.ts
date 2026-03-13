import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserServices from "../instances/userRequest";
// import { Tcreate_transactionSchema } from "constants/transaction.type";


const {  alltransactions, createuserwithdrawl, allkycs, kycStatus, bulkPayout } = new UserServices()

class UserQueries {

    // staleTime: 1000, gcTime: 1000,
  
    useAlTransactions = () => {
        return useQuery({queryKey:["alltransactions"], queryFn: alltransactions });
    };

    useAllKycs = () => {
        return useQuery({queryKey:["kycs"], queryFn: allkycs });
    };

    setKycStatus = () => {
      const queryClient = useQueryClient();

      return  useMutation({
      mutationFn: (data: {id: string, admin_verify_status: "approved" | "rejected", reason?: string}) => {
        return kycStatus(data)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['kycs'] });
      }
    });
    }


    setCreateuserWithdrawal = () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (data: {txnId: string}) => createuserwithdrawl(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['alltransactions'] });
        }
      });
    }

    useBulkPayout = () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: () => bulkPayout(),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['alltransactions'] });
        }
      });
    }
}

export default UserQueries;