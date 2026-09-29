"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Search, Plus, Check } from "lucide-react";
import { Place } from "@/types/database";
import { FALLBACK_PLACES } from "@/lib/data/placesData";
import { Button } from "@/components/ui/Button";

interface AddPlaceToTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPlaceIds: string[];
  onAddPlace: (place: Place, options?: { timeSlot?: string; note?: string }) => void;
}

export function AddPlaceToTripModal({
  isOpen,
  onClose,
  existingPlaceIds,
  onAddPlace,
}: AddPlaceToTripModalProps) {
  const [search, setSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const filteredPlaces = FALLBACK_PLACES.filter((p) => {
    const q = search.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.category?.name && p.category.name.toLowerCase().includes(q))
    );
  });

  const handleConfirmAdd = () => {
    if (!selectedPlace) return;
    onAddPlace(selectedPlace, {
      timeSlot: timeSlot.trim() || undefined,
      note: note.trim() || undefined,
    });
    setSelectedPlace(null);
    setTimeSlot("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden rounded-3xl bg-white p-5 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">เพิ่มสถานที่ในทริป</h2>
            <p className="text-[11px] text-slate-500">เลือกสถานที่ท่องเที่ยวจากรายการ</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="pt-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสถานที่, น้ำตก, วัด, คาเฟ่..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Places List */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 no-scrollbar">
          {filteredPlaces.map((place) => {
            const isAlreadyInTrip = existingPlaceIds.includes(place.id);
            const isSelected = selectedPlace?.id === place.id;

            return (
              <div
                key={place.id}
                onClick={() => {
                  if (!isAlreadyInTrip) {
                    setSelectedPlace(place);
                  }
                }}
                className={`flex items-center gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isAlreadyInTrip
                    ? "opacity-50 bg-slate-50 border-slate-100 cursor-not-allowed"
                    : isSelected
                    ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
                    : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50/70"
                }`}
              >
                <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                  <Image
                    src={place.cover_image}
                    alt={place.name}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {place.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {place.category?.name || "สถานที่ท่องเที่ยว"} • อ.{place.district}
                  </div>
                </div>

                <div className="shrink-0">
                  {isAlreadyInTrip ? (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 px-2 py-1 rounded-lg">
                      อยู่ในทริปแล้ว
                    </span>
                  ) : isSelected ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Place Options (Time / Notes) */}
        {selectedPlace && (
          <div className="pt-3 border-t border-slate-100 space-y-2.5 shrink-0 bg-slate-50 p-3 rounded-2xl mt-2">
            <div className="text-xs font-bold text-emerald-800">
              กำหนดเวลา & บันทึกสำหรับ: {selectedPlace.name}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="เวลา (เช่น 10:00 น.)"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:border-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="โน้ต (เช่น พักทานข้าว)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 text-xs"
          >
            ยกเลิก
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!selectedPlace}
            onClick={handleConfirmAdd}
            className="flex-1 h-10 text-xs shadow-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>เพิ่มลงทริป</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
