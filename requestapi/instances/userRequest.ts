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
  senderEmail?: string;
  amount?: number;
  convertedAmount?: number;
  currency?: string;
  fxRate?: number;
  baseCurrency?: string;
  targetCurrency?: string;
  paymentoption?: string;
  category?: string;
  servicelink?: string
  updatedAt?:  string,
  createdAt?: string,
  header?: string,
  recipientName?: string;
  account_number?: string;
  bank_name?: string;
  user?: {
    fullname: string
    email: string
    phone_number: string
    bank_account?: {
      accountNumber: string
      bankName: string
      bankCode: string
      accountName: string
    }
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





const kycstatue = "/api/admin/kycstatue";
const allkycs = "/api/user/kycs";
const alltransactions = "/api/user/transactions";
const sendmoney = "/api/user/sendmoney";
const bulkpayout = "/api/admin/payout/bulk";


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
    
    async kycStatus({id, admin_verify_status, reason = ""}: {id: string, admin_verify_status: "approved" | "rejected", reason?: string}) {
        const response = await rootAxiosInstance.patch(`${kycstatue}/${id}`, {admin_verify_status, reason});
        return response.data
    }

    /**
     * Manually mark a single withdrawal transaction as sent
     */
    async createuserwithdrawl(data: {txnId: string}) {
        return await rootAxiosInstance.post(sendmoney, data)
    }

    /**
     * Trigger Paystack bulk transfer for ALL pending withdrawal transactions.
     * Skips users without a paystack_recipient_code.
     * Marks processed transactions as isPending=false.
     */
    async bulkPayout(): Promise<{ message: string; processed?: number; skipped?: number }> {
        const response = await rootAxiosInstance.post(bulkpayout, {})
        return response.data
    }
}

export default UserServices;
