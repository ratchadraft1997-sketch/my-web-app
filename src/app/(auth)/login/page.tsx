import { Suspense } from "react";
import { Metadata } from "next";
import { Compass, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | Nakhon Nayok Trip",
  description: "เข้าสู่ระบบเพื่อบันทึกสถานที่โปรดและจัดการทริปท่องเที่ยวนครนายกของคุณ",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md mb-3">
            <Compass className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">ยินดีต้อนรับกลับมา</h1>
          <p className="text-xs text-slate-500 mt-1">เข้าสู่ระบบเพื่อจัดการทริปนครนายกของคุณ</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>เข้าสู่ระบบ</CardTitle>
            <CardDescription>เลือกวิธีเข้าสู่ระบบที่สะดวกสำหรับคุณ</CardDescription>
          </CardHeader>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

