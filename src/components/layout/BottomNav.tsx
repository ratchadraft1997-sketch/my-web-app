"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "หน้าแรก",
    href: "/",
    icon: Home,
  },
  {
    label: "สำรวจ",
    href: "/places",
    icon: MapPin,
  },
  {
    label: "ทริปของฉัน",
    href: "/trips",
    icon: CalendarDays,
  },
  {
    label: "โปรไฟล์",
    href: "/profile",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg pb-safe">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2 sm:max-w-lg md:max-w-2xl">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1 text-center transition-colors",
                isActive
                  ? "text-emerald-600 font-semibold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                  isActive ? "bg-emerald-50 scale-110" : ""
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-2")} />
              </div>
              <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

