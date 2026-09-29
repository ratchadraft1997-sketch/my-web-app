import Link from "next/link";
import { Ambulance, ArrowUpRight, PhoneCall, ShieldAlert } from "lucide-react";

const emergencyContacts = [
  {
    label: "เหตุด่วนเหตุร้าย",
    number: "191",
    description: "แจ้งตำรวจเมื่อมีเหตุฉุกเฉิน",
    icon: ShieldAlert,
    tone: "bg-rose-600 hover:bg-rose-700",
  },
  {
    label: "แพทย์ฉุกเฉิน",
    number: "1669",
    description: "เรียกรถพยาบาลและทีมกู้ชีพ",
    icon: Ambulance,
    tone: "bg-sky-600 hover:bg-sky-700",
  },
  {
    label: "ตำรวจท่องเที่ยว",
    number: "1155",
    description: "ช่วยเหลือนักท่องเที่ยว 24 ชม.",
    icon: PhoneCall,
    tone: "bg-amber-500 hover:bg-amber-600",
  },
];

export function EmergencyContacts({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "" : "rounded-3xl border border-rose-100 bg-rose-50/60 p-4 shadow-xs"} aria-labelledby="emergency-heading">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 id="emergency-heading" className="text-base font-bold text-slate-900">ติดต่อฉุกเฉิน</h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">หากมีอันตราย โทรได้ทันที พร้อมแจ้งตำแหน่งหรือพิกัด Google Maps</p>
        </div>
        {!compact && (
          <Link href="/places?category=hospitals" className="shrink-0 text-[11px] font-semibold text-emerald-700 hover:underline">
            หา รพ. ใกล้ฉัน
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {emergencyContacts.map(({ label, number, description, icon: Icon, tone }) => (
          <a key={number} href={`tel:${number}`} className={`group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-white shadow-sm transition-colors ${tone}`}>
            <Icon className="h-5 w-5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-white/85">{label}</span>
              <span className="block text-lg font-black leading-tight">{number}</span>
              <span className="block truncate text-[10px] text-white/80">{description}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 shrink-0 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        ))}
      </div>
    </section>
  );
}
