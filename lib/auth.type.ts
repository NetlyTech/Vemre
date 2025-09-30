
import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string()
    .min(1, "Required")
     
  });

  // export const registerSchema = z
  // .object({
  //   email: z.string().email(),
  //   password: z
  //     .string()
  //     .min(6, "Password must be at least 6 characters ")
  // });


  export const emailSchema = z
  .object({
    email: z.string().email()
  });


export const passwordSchema = z
  .object({
    code: z.string().min(4, "invalid code"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmpassword: z.string().min(6, "Password must be at least 6 characters")
  }).refine((data) => data.password == data.confirmpassword, {
    message: "Password does not match",
    path: ["confirmpassword"]
  });


  // export type  TregisterSchema = z.infer<typeof registerSchema>;
  export type  TloginSchema = z.infer<typeof loginSchema>;
  export type  TpasswordSchema = z.infer<typeof passwordSchema>;
  export type  TemailSchema = z.infer<typeof emailSchema>;



export const userSchema = z.object({
   data: z.object({
   _id: z.string(),
   email: z.string().email(), 

   avatar: z.string().nullish(), 
   phone_number: z.string().nullish(), 
   fullname: z.string().nullish(), 
   gender: z.string().nullish(), 
   dob: z.string().nullish(), 
   country: z.string().nullish(), 
  city: z.string().nullish(), 

  social: z.object({
    facebook: z.string().nullish(), 
    twitter:  z.string().nullish(), 
    instagram:  z.string().nullish(), 
  }).nullish(),

   account_type: z.enum(["User",'Admin']), 
   verify_account: z.boolean()
  }),
  token: z.string(),
});


export type  TuserSchema = z.infer<typeof userSchema>;

// export const userNameSchema = z.object({
//   fullname: z.string().min(3, "Too short")
// });

// export type  TuserNameSchema = z.infer<typeof userNameSchema>;


