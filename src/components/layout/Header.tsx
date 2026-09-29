import Link from "next/link";
import { Compass, User, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getDemoUserFromCookieValue } from "@/lib/auth/demo-user";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { DemoUser } from "@/lib/auth/demo-user";

export async function Header() {
  const demoUser = getDemoUserFromCookieValue((await cookies()).get("demo_user")?.value);
  let user: DemoUser | SupabaseUser | null = demoUser;
  if (!user) {
    try {
      const supabase = await createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      user = authUser;
    } catch {
      // If Supabase is unavailable, show the signed-out navigation state.
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between gap-2 px-3 sm:max-w-lg md:max-w-2xl">
        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2 font-bold text-slate-900 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <span className="block truncate text-[0.9rem] font-extrabold leading-tight text-emerald-800">
              Nakhon Nayok Trip
            </span>
            <span className="block truncate text-[9px] font-medium text-slate-500 leading-none">
              เที่ยวนครนายก ง่าย ครบ จบในที่เดียว
            </span>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <User className="h-3.5 w-3.5" />
              <span className="max-w-[88px] truncate">
                {user.user_metadata?.full_name || "โปรไฟล์"}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
