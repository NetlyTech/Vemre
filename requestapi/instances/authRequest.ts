
import { TemailSchema, TloginSchema, TpasswordSchema } from "@/lib/auth.type";
import rootAxiosInstance from "../axiosinstance";

const login = "/api/auth/adminlogin";
const forgetPassword = "/api/auth/forgetPassword";
const changepassword = "/api/auth/changepassword";

export type TVerifyUser = {
    id: string,
    email: string
}

class AuthServices {

    /**
     * To login a user
     * @returns
     */
    async loginUser(data: TloginSchema) {
        const res = await rootAxiosInstance.post(login, data)
        return res.data
    }

    /**
     * send forget password
     * @returns
     */
    async forgetPassword({email}: TemailSchema) {
        const res = await rootAxiosInstance.post(forgetPassword, {email})
        return res.data
    }

     /**
     * To reset_password
     * @returns
     */
    async resetPassword(data: TpasswordSchema) {
        const res = await rootAxiosInstance.post(changepassword, data)
        return res.data
    }

}

export default AuthServices;