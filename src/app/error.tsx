"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shadow-xs">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">เกิดข้อผิดพลาดในการโหลดหน้าเว็บ</h2>
        <p className="text-xs text-slate-500 max-w-xs">
          ระบบพบปัญหาชั่วคราว กรุณากดปุ่มด้านล่างเพื่อลองใหม่อีกครั้ง
        </p>
      </div>
      <Button
        onClick={() => reset()}
        variant="secondary"
        className="text-xs"
      >
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        ลองใหม่อีกครั้ง
      </Button>
    </div>
  );
}

