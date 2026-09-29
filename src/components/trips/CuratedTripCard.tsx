"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Banknote, Sparkles, Copy, Check, ChevronRight, MapPin } from "lucide-react";
import { TripPlan } from "@/types/trip";
import { useTrips } from "@/lib/hooks/useTrips";
import { Button } from "@/components/ui/Button";

interface CuratedTripCardProps {
  trip: TripPlan;
}

export function CuratedTripCard({ trip }: CuratedTripCardProps) {
  const { duplicateCuratedTrip } = useTrips();
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    duplicateCuratedTrip(trip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-52">
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-xs">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>แผนแนะนำยอดฮิต</span>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span>{trip.duration}</span>
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white drop-shadow-sm line-clamp-1">
            {trip.title}
          </h3>
          {trip.estimatedBudget && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-200 mt-0.5">
              <Banknote className="h-3.5 w-3.5" />
              <span>งบประมาณ {trip.estimatedBudget}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3.5">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {trip.description}
        </p>

        {/* Stops Preview Sequence */}
        <div className="space-y-1.5 rounded-2xl bg-slate-50 p-3 border border-slate-100">
          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-emerald-600" />
            <span>เส้นทางท่องเที่ยว ({trip.items.length} จุดแวะ):</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {trip.items.map((item, index) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200/70 rounded-lg px-2 py-0.5"
              >
                <span className="text-[10px] text-emerald-600 font-bold">{index + 1}.</span>
                <span className="truncate max-w-[120px]">{item.placeName.split("(")[0].trim()}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Link href={`/trips/${trip.id}`} className="flex-1">
            <Button variant="primary" className="w-full h-10 text-xs shadow-xs">
              <span>ดูแผนเที่ยว & นำทาง</span>
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handleCopy}
            className={`h-10 px-3 text-xs transition-all shrink-0 ${
              copied
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "text-slate-700 hover:bg-slate-50"
            }`}
            title="คัดลอกเป็นทริปของฉัน"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1 text-slate-500" />
                <span>คัดลอก</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

