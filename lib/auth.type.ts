
import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string()
    .min(1, "Required")

  });


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


  export type  TloginSchema = z.infer<typeof loginSchema>;
  export type  TpasswordSchema = z.infer<typeof passwordSchema>;
  export type  TemailSchema = z.infer<typeof emailSchema>;


export const userSchema = z.object({
  token: z.string(),
  admin: z.object({
    _id: z.string(),
    email: z.string().email(),
    fullname: z.string().nullish(),
    role: z.enum(["international", "local"]),
    isActive: z.boolean(),
  }),
});


export type TuserSchema = z.infer<typeof userSchema>;
export type TAdminRole = "international" | "local";
