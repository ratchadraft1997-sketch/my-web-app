import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "กรุณากรอกอีเมล" })
    .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
  password: z
    .string()
    .min(1, { message: "กรุณากรอกรหัสผ่าน" })
    .min(6, { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "กรุณากรอกชื่อ-นามสกุล" })
      .min(2, { message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร" })
      .max(100, { message: "ชื่อมีความยาวเกินกำหนด" }),
    email: z
      .string()
      .min(1, { message: "กรุณากรอกอีเมล" })
      .email({ message: "รูปแบบอีเมลไม่ถูกต้อง" }),
    password: z
      .string()
      .min(1, { message: "กรุณากรอกรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" }),
    confirmPassword: z
      .string()
      .min(1, { message: "กรุณายืนยันรหัสผ่าน" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

