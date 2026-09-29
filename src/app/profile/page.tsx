import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { User, Mail, Calendar, LogOut, ShieldCheck, Heart, Map } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDemoUserFromCookieValue } from "@/lib/auth/demo-user";
import { formatThaiDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "โปรไฟล์ส่วนตัว | Nakhon Nayok Trip",
  description: "จัดการข้อมูลส่วนตัวและบัญชีผู้ใช้งาน Nakhon Nayok Trip",
};

export default async function ProfilePage() {
  let user: {
    id: string;
    email?: string;
    created_at?: string;
    user_metadata?: { full_name?: string };
  } | null = null;

  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("demo_user");

  if (demoCookie?.value) {
    const parsedDemoUser = getDemoUserFromCookieValue(demoCookie.value);
    if (parsedDemoUser) {
      user = parsedDemoUser;
    } else {
      user = {
        id: "demo-user-id",
        email: "traveler@nakhonnayok.app",
        created_at: new Date().toISOString(),
        user_metadata: { full_name: "นักเดินทางทดลองใช้" },
      };
    }
  } else {
    try {
      const supabase = await createClient();
      const authPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), 1500)
      );
      const {
        data: { user: authUser },
      } = await Promise.race([authPromise, timeoutPromise]);
      user = authUser;
    } catch {
      user = null;
    }
  }

  if (!user) {
    redirect("/login?redirect=/profile");
  }

  const fullName = user.user_metadata?.full_name || "นักเดินทาง";
  const email = user.email || "-";
  const createdAt = user.created_at || new Date().toISOString();

  return (
    <div className="space-y-6 py-4">
      {/* Top Banner / Avatar */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white text-2xl font-bold shadow-inner">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>สมาชิกผู้ใช้งาน</span>
            </div>
            <h1 className="text-xl font-bold truncate">{fullName}</h1>
            <p className="text-xs text-emerald-100/80 truncate">{email}</p>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลบัญชี</CardTitle>
          <CardDescription>รายละเอียดบัญชีผู้ใช้งานของคุณ</CardDescription>
        </CardHeader>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-500">
              <User className="h-4 w-4" />
              <span>ชื่อ-นามสกุล</span>
            </div>
            <span className="font-semibold text-slate-800">{fullName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Mail className="h-4 w-4" />
              <span>อีเมล</span>
            </div>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">
              {email}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>วันที่สมัครสมาชิก</span>
            </div>
            <span className="font-semibold text-slate-800">
              {formatThaiDate(createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>User ID</span>
            <span className="font-mono">{user.id.slice(0, 16)}...</span>
          </div>
        </div>
      </Card>

      {/* Feature Preview shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/places"
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center hover:border-emerald-200 active:scale-95 transition-all block"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 mb-2">
            <Heart className="h-5 w-5" />
          </div>
          <div className="text-xs font-bold text-slate-800">สถานที่ท่องเที่ยว</div>
          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">สำรวจที่เที่ยว</div>
        </Link>

        <Link
          href="/trips"
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm text-center hover:border-emerald-200 active:scale-95 transition-all block"
        >
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-2">
            <Map className="h-5 w-5" />
          </div>
          <div className="text-xs font-bold text-slate-800">ทริปของฉัน</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">จัดการทริปเที่ยว</div>
        </Link>
      </div>

      {/* Sign Out Button */}
      <form action="/auth/signout" method="POST">
        <Button
          type="submit"
          variant="danger"
          className="w-full h-12 shadow-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          ออกจากระบบ
        </Button>
      </form>
    </div>
  );
}
