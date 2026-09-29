import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatThaiDate(dateString: string | null | undefined): string {
  if (!dateString) return "ไม่ระบุ";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function mapAuthErrorMessage(errorMsg: string): string {
  if (errorMsg.includes("Invalid login credentials")) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
  if (errorMsg.includes("User already registered") || errorMsg.includes("already exists")) {
    return "อีเมลนี้มีผู้ใช้งานแล้ว";
  }
  if (errorMsg.includes("Email not confirmed")) {
    return "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ";
  }
  if (errorMsg.includes("Password should be at least")) {
    return "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
  }
  if (errorMsg.includes("rate limit") || errorMsg.includes("too many requests")) {
    return "คำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  }
  return `เกิดข้อผิดพลาด: ${errorMsg}`;
}

