import Link from "next/link";
import Image from "next/image";
import { Clock3, Star, MapPin, Ticket } from "lucide-react";
import { Place } from "@/types/database";

interface PlaceCardProps {
  place: Place;
  compact?: boolean;
}

export function PlaceCard({ place, compact = false }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
    >
      {/* Cover Image Container */}
      <div className={`relative w-full overflow-hidden bg-slate-100 ${compact ? "h-32" : "h-40"}`}>
        <Image
          src={place.cover_image}
          alt={place.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-bold text-amber-300 backdrop-blur-md shadow-xs">
          <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
          <span>{place.rating.toFixed(1)}</span>
        </div>

        {/* Category Badge */}
        {place.category && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-slate-800 backdrop-blur-md shadow-xs">
            <span>{place.category.icon}</span>
            <span>{place.category.name}</span>
          </div>
        )}

        {place.crowd_level && (
          <div className="absolute bottom-2.5 left-2.5 rounded-full bg-slate-900/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            {place.crowd_level}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col justify-between space-y-2 p-3">
        <div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{place.district || "นครนายก"}</span>
          </div>

          <h3 className="mt-0.5 line-clamp-1 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-700">
            {place.name}
          </h3>

          {place.highlight && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
              {place.highlight}
            </p>
          )}
        </div>

        <div className="space-y-1.5 border-t border-slate-50 pt-2 text-[10px]">
          <div className="flex flex-wrap gap-1.5">
            {place.vibes?.slice(0, 2).map((vibe) => (
              <span key={vibe} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                {vibe}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1.5 truncate text-slate-500">
            <Clock3 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="truncate">{place.opening_hours || "โปรดตรวจสอบเวลาก่อนเดินทาง"}</span>
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-1.5 font-medium text-slate-600">
              <Ticket className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">{place.fee || "เข้าชมฟรี"}</span>
            </span>
            <span className="shrink-0 font-medium text-emerald-600 group-hover:underline">รายละเอียด →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
