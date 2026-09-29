"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Navigation,
  Trash2,
  Plus,
  StickyNote,
} from "lucide-react";
import { TripPlaceItem } from "@/types/trip";
import { Button } from "@/components/ui/Button";

interface TripTimelineProps {
  items: TripPlaceItem[];
  isEditable?: boolean;
  onToggleVisited?: (itemId: string) => void;
  onRemoveItem?: (itemId: string) => void;
  onOpenAddPlace?: () => void;
}

export function TripTimeline({
  items,
  isEditable = false,
  onToggleVisited,
  onRemoveItem,
  onOpenAddPlace,
}: TripTimelineProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
          <MapPin className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">ยังไม่มีสถานที่ในทริปนี้</h3>
        <p className="text-xs text-slate-400 max-w-xs mt-1 mb-4">
          เริ่มเพิ่มสถานที่ท่องเที่ยว น้ำตก คาเฟ่ หรือวัด เพื่อจัดลำดับการเดินทางของคุณ
        </p>
        {isEditable && onOpenAddPlace && (
          <Button variant="primary" onClick={onOpenAddPlace} className="h-10 text-xs">
            <Plus className="h-4 w-4 mr-1" />
            <span>เลือกเพิ่มสถานที่ท่องเที่ยว</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 sm:before:left-4">
        {items.map((item, index) => {
          return (
            <div key={item.id} className="relative group">
              {/* Step Icon / Number Indicator */}
              <div
                className={`absolute -left-6 sm:-left-8 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all shadow-xs ${
                  item.visited
                    ? "bg-emerald-600 border-white text-white"
                    : "bg-white border-emerald-500 text-emerald-700"
                }`}
              >
                {item.visited ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Item Content Card */}
              <div
                className={`rounded-3xl border p-4 bg-white shadow-xs transition-all ${
                  item.visited
                    ? "border-emerald-200 bg-emerald-50/30"
                    : "border-slate-100 hover:border-emerald-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-3.5">
                  {/* Thumbnail */}
                  <Link
                    href={`/places/${item.placeSlug}`}
                    className="relative h-28 w-full sm:w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 block"
                  >
                    <Image
                      src={item.coverImage}
                      alt={item.placeName}
                      fill
                      sizes="(max-width: 640px) 100vw, 130px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.categoryIcon && (
                      <div className="absolute top-2 left-2 rounded-lg bg-white/90 px-1.5 py-0.5 text-xs backdrop-blur-xs">
                        {item.categoryIcon}
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {item.timeSlot && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mb-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{item.timeSlot}</span>
                          </div>
                        )}
                        <Link
                          href={`/places/${item.placeSlug}`}
                          className="text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-1 transition-colors"
                        >
                          {item.placeName}
                        </Link>
                      </div>

                      {/* Visited Checkbox Toggle */}
                      {onToggleVisited && (
                        <button
                          type="button"
                          onClick={() => onToggleVisited(item.id)}
                          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            item.visited
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {item.visited ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>แวะแล้ว</span>
                            </>
                          ) : (
                            <>
                              <Circle className="h-3.5 w-3.5" />
                              <span>ยังไม่แวะ</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>อ.{item.district || "เมืองนครนายก"} จ.นครนายก</span>
                    </div>

                    {/* Note / Tip */}
                    {item.note && (
                      <div className="flex items-start gap-1.5 rounded-xl bg-slate-50 p-2 text-xs text-slate-600 border border-slate-100/80">
                        <StickyNote className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item.note}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {item.googleMapsUrl && (
                          <a
                            href={item.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <Navigation className="h-3.5 w-3.5" />
                            <span>เปิดแผนที่</span>
                          </a>
                        )}
                        <Link
                          href={`/places/${item.placeSlug}`}
                          className="text-xs text-slate-500 hover:text-slate-800 font-medium px-1"
                        >
                          ดูรายละเอียด
                        </Link>
                      </div>

                      {isEditable && onRemoveItem && (
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="ลบออกจากทริป"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isEditable && onOpenAddPlace && (
        <div className="pt-2 text-center">
          <Button
            type="button"
            variant="outline"
            onClick={onOpenAddPlace}
            className="w-full h-11 text-xs border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50"
          >
            <Plus className="h-4 w-4 mr-1 text-emerald-600" />
            <span>เพิ่มจุดแวะต่อไปในทริปนี้</span>
          </Button>
        </div>
      )}
    </div>
  );
}
