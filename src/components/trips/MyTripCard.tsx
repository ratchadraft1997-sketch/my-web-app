"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Trash2, CheckCircle2 } from "lucide-react";
import { TripPlan } from "@/types/trip";
import { useTrips } from "@/lib/hooks/useTrips";
import { formatThaiDate } from "@/lib/utils";

interface MyTripCardProps {
  trip: TripPlan;
}

export function MyTripCard({ trip }: MyTripCardProps) {
  const { deleteTrip } = useTrips();
  const [showConfirm, setShowConfirm] = useState(false);

  const visitedCount = trip.items.filter((i) => i.visited).length;
  const progressPercent =
    trip.items.length > 0 ? Math.round((visitedCount / trip.items.length) * 100) : 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTrip(trip.id);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xs transition-all hover:border-emerald-200 hover:shadow-md">
      {/* Clickable Area */}
      <Link href={`/trips/${trip.id}`} className="block">
        <div className="flex flex-col sm:flex-row">
          {/* Cover image thumbnail */}
          <div className="relative h-36 w-full shrink-0 bg-slate-100 sm:h-auto sm:w-44">
            <Image
              src={
                trip.items.length > 0 && trip.items[0].coverImage
                  ? trip.items[0].coverImage
                  : trip.coverImage ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
              }
              alt={trip.title}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent sm:hidden" />

            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                <Clock className="h-2.5 w-2.5 text-emerald-400" />
                <span>{trip.duration || "1 วัน"}</span>
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                  {trip.title}
                </h3>
              </div>

              <p className="text-xs text-slate-500 line-clamp-1">
                {trip.description || "ไม่มีรายละเอียดเพิ่มเติม"}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-600" />
                  <span>{trip.items.length} สถานที่</span>
                </span>
                <span>•</span>
                <span>สร้างเมื่อ {formatThaiDate(trip.createdAt)}</span>
              </div>
            </div>

            {/* Progress Section */}
            <div className="pt-3 space-y-1.5 border-t border-slate-50 mt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>เช็คอินแล้ว {visitedCount}/{trip.items.length} จุด</span>
                </span>
                <span className="font-bold text-emerald-600">{progressPercent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete / Actions floating button */}
      <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
        {showConfirm ? (
          <div className="flex items-center gap-1 rounded-2xl bg-white p-1 shadow-md border border-rose-100">
            <button
              onClick={handleDelete}
              className="rounded-xl bg-rose-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-rose-600 transition-colors"
            >
              ลบทริป
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowConfirm(false);
              }}
              className="rounded-xl bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowConfirm(true);
            }}
            title="ลบทริปนี้"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-400 shadow-xs hover:text-rose-500 hover:bg-white backdrop-blur-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
