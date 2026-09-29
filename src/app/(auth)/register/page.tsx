import { Metadata } from "next";
import { UserPlus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "สมัครสมาชิก | Nakhon Nayok Trip",
  description: "สร้างบัญชีผู้ใช้งานใหม่สำหรับวางแผนท่องเที่ยวนครนายก",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md mb-3">
            <UserPlus className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">สร้างบัญชีผู้ใช้ใหม่</h1>
          <p className="text-xs text-slate-500 mt-1">เริ่มต้นวางแผนการเดินทางในนครนายก</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>สมัครสมาชิก</CardTitle>
            <CardDescription>กรอกข้อมูลด้านล่างเพื่อสร้างบัญชี</CardDescription>
          </CardHeader>
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
}

