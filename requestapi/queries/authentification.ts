import { useMutation } from "@tanstack/react-query"
import AuthServices from "../instances/authRequest"
import { TemailSchema, TloginSchema, TpasswordSchema } from "@/lib/auth.type"

const { loginUser,  forgetPassword,resetPassword} = new AuthServices()

class Authentification {
    

    loginUserMutation() {
        return  useMutation({
            mutationFn: ({email, password}:TloginSchema) => {
              return loginUser({email, password})
            },
          })
    }

    forgetPasswordMutation() {
        return  useMutation({
            mutationFn: ({email}: TemailSchema) => {
              return forgetPassword({email})
            },
          })
    }

    // resendVerifyCodeMutation() {
    //     return  useMutation({
    //         mutationFn: ({email}: Omit<TVerifyUser, "id">) => {
    //           return resendVerifyCode({email})
    //         },
    //       })
    // }

    
    // forgetPasswordMutation() {
    //     return  useMutation({
    //         mutationFn: ({email}: Omit<TVerifyUser, "id">) => {
    //           return resetPassword({email})
    //         },
    //       })
    // }

    changePasswordMutation() {
        return  useMutation({
            mutationFn: ({ password, code, confirmpassword}: TpasswordSchema) => {
              return resetPassword({ password, code, confirmpassword})
            },
          })
    }




}

export default Authentification;