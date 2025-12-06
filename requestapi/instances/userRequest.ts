import rootAxiosInstance from "../axiosinstance";

export type ActivityProps = {
  _id: string,
  type?:  "Withdraw" | "Received",
  isPending?: boolean,
  isVemreCharge?: boolean,
  title?: string;
  description?: string;
  transactionReference?: string;
  senderName?: string;
  amount?: number;
  category?: string;
  servicelink?: string
  updatedAt?:  string,
  header?: string,
  recipientName?: string;
  account_number?: string;
  bank_name?: string;
  user?: {
    fullname: string
    email: string
    phone_number: string
  }
  
}


export interface VerificationData {
  _id: string;
  admin_verify_status: "approved" | "rejected" | "pending";        // "pending"
  avatar: string;
  createdAt: string;
  documentNumber: string;
  firstname: string;
  lastname: string;
  provider: string;                   // "qoreid"
  result: VerificationResult;
  status: string;                     // "verified"
  type: string;                       // "nin"
  updatedAt: string;
  user: User;
  __v: number;
}

export interface VerificationResult {
  id: number;
  applicant: ApplicantInfo;
  summary: SummaryInfo;
  status: StatusInfo;
  nin: NinInfo;
}

export interface ApplicantInfo {
  // add fields based on real structure
  [key: string]: any;
}

export interface SummaryInfo {
  // add fields based on real structure
  [key: string]: any;
}

export interface StatusInfo {
  // add fields based on real structure
  [key: string]: any;
}

export interface NinInfo {
  // add fields based on real structure
  [key: string]: any;
}

export interface User {
  _id: string;
  email: string;
  fullname: string;
  phone_number: string;
  location: UserLocation;
  [key: string]: any; // for extra props
}

export interface UserLocation {
  // add fields based on real structure
  [key: string]: any;
}





const kycstatue = "/api/user/kycstatue";
const allkycs = "/api/user/kycs";
const alltransactions = "/api/user/transactions";
const sendmoney = "/api/user/sendmoney";


class UserServices {


    /**
     * To get all transactions
     * @returns
     */
    
    async alltransactions(): Promise<{data: ActivityProps[]}> {
        const response = await rootAxiosInstance.get(alltransactions);
        return response.data
    }
    /**
     * To get all kycs
     * @returns
     */
    
    async allkycs(): Promise<{data: VerificationData[]}> {
        const response = await rootAxiosInstance.get(allkycs);
        return response.data
    }
    /**
     * To get all kycs
     * @returns
     */
    
    async kycStatus({id, admin_verify_status}: {id: string, admin_verify_status: "approved" |  "rejected"}) {
        const response = await rootAxiosInstance.patch(`${kycstatue}/${id}`, {admin_verify_status});
        return response.data
    }

       /**
     * create 
     * @returns
     */
       async createuserwithdrawl(data: {txnId: string}) {
        return await rootAxiosInstance.post(sendmoney, data)
    }


}

export default UserServices;
