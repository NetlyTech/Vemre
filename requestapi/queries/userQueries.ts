import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserServices from "../instances/userRequest";
// import { Tcreate_transactionSchema } from "constants/transaction.type";


const {  alltransactions, createuserwithdrawl} = new UserServices()

class UserQueries {

    // staleTime: 1000, gcTime: 1000,
  
    useAlTransactions = () => {
        return useQuery({queryKey:["alltransactions"], queryFn: alltransactions });
    };

    setCreateuserWithdrawal = () => {
      const queryClient = useQueryClient();

      return  useMutation({
      mutationFn: (data: {txnId: string}) => {
        return createuserwithdrawl(data)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['alltransactions'] });
      }
    });
    }
      
     


}

export default UserQueries;