import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-inner">
        <Compass className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <span className="text-4xl font-black text-emerald-600">404</span>
        <h2 className="text-lg font-bold text-slate-900">ไม่พบหน้าที่คุณต้องการ</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ
        </p>
      </div>
      <Link href="/">
        <Button className="text-xs mt-2">
          <Home className="mr-1.5 h-3.5 w-3.5" />
          กลับสู่หน้าแรก
        </Button>
      </Link>
    </div>
  );
}

