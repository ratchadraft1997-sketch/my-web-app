import Link from "next/link";
import {
  Sparkles,
  LogIn,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cookies } from "next/headers";
import { getDemoUserFromCookieValue } from "@/lib/auth/demo-user";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/services/categories";
import { getPlaces } from "@/lib/services/places";
import { PlaceCard } from "@/components/places/PlaceCard";
import { EmergencyContacts } from "@/components/safety/EmergencyContacts";

const AUTH_TIMEOUT_MS = 350;

export default async function HomePage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("demo_user");
  let user: {
    id: string;
    email?: string;
    user_metadata?: { full_name?: string };
  } | null = getDemoUserFromCookieValue(demoCookie?.value);

  if (!user) {
    try {
      const supabase = await createClient();
      const authPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), AUTH_TIMEOUT_MS)
      );
      const {
        data: { user: authUser },
      } = await Promise.race([authPromise, timeoutPromise]);
      user = authUser;
    } catch {
      // Supabase fallback
    }
  }

  const [categories, featuredPlaces] = await Promise.all([
    getCategories(),
    getPlaces({ featuredOnly: true }),
  ]);

  return (
    <div className="space-y-5 py-3">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-4 text-white shadow-xl sm:p-6">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>ยินดีต้อนรับสู่นครนายก</span>
          </div>

          <h1 className="text-[1.6rem] font-black leading-tight tracking-tight sm:text-3xl">
            สัมผัสธรรมชาติใกล้กรุง <br />
            <span className="text-emerald-300">เที่ยวนครนายก</span> กับเรา
          </h1>

          <p className="max-w-[18rem] text-[11px] leading-relaxed text-emerald-100/90 sm:text-sm">
            ค้นพบน้ำตก ภูเขา คาเฟ่สุดชิค และวางแผนทริปท่องเที่ยวได้ง่ายๆ ในแอปเดียว
          </p>

          <div className="pt-1">
            {user ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-[11px] font-bold text-emerald-800 shadow-md transition-all hover:bg-emerald-50 active:scale-95"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>สวัสดีคุณ {user.user_metadata?.full_name || "นักเดินทาง"}</span>
              </Link>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2.5 text-[11px] font-bold text-emerald-800 shadow-md transition-all hover:bg-emerald-50 active:scale-95"
                >
                  <UserPlus className="h-4 w-4 text-emerald-600" />
                  <span>เริ่มต้นใช้งาน</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-white/20 px-3.5 py-2.5 text-[11px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95"
                >
                  <LogIn className="h-4 w-4" />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-emerald-500/20 blur-2xl" />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          {
            title: "เลือกสถานที่",
            desc: "ค้นหาจุดเช็คอินที่ใช่",
            action: "/places",
            accent: "bg-emerald-50 text-emerald-700",
          },
          {
            title: "วางแผนทริป",
            desc: "จัด маршруศุกร์-อาทิตย์",
            action: "/trips",
            accent: "bg-amber-50 text-amber-700",
          },
          {
            title: "ข้อมูลปลอดภัย",
            desc: "ติดต่อฉุกเฉินพร้อมใช้งาน",
            action: "/profile",
            accent: "bg-sky-50 text-sky-700",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.action}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md active:scale-[0.99]"
          >
            <div className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${item.accent}`}>
              {item.title}
            </div>
            <div className="mt-2 text-sm font-bold text-slate-900">{item.desc}</div>
          </Link>
        ))}
      </section>

      <EmergencyContacts />

      {/* Categories Horizontal Scroll */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">หมวดหมู่ท่องเที่ยว</h2>
          <Link
            href="/places"
            className="flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            <span>ดูทั้งหมด</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 py-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/places?category=${cat.slug}`}
              className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs hover:border-emerald-200 active:scale-95 transition-all w-24 text-center"
            >
              <span className="text-2xl mb-1">{cat.icon || "📍"}</span>
              <span className="text-[11px] font-semibold text-slate-700 line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">สถานที่ยอดนิยม แนะนำ</h2>
            <p className="text-[11px] text-slate-500">จุดเช็คอินไฮไลท์ที่ไม่ควรพลาด</p>
          </div>
          <Link
            href="/places"
            className="flex items-center text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            <span>ทั้งหมด</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {featuredPlaces.slice(0, 4).map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 active:scale-98 transition-all"
          >
            <span>สำรวจสถานที่ทั้งหมดในนครนายก ({featuredPlaces.length}+ แห่ง)</span>
            <ArrowRight className="h-4 w-4 text-emerald-600" />
          </Link>
        </div>
      </section>
    </div>
  );
}
