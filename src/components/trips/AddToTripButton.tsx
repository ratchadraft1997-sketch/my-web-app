"use client";

import { useState } from "react";
import { Plus, Check, MapPin, X, CalendarDays } from "lucide-react";
import { Place } from "@/types/database";
import { useTrips } from "@/lib/hooks/useTrips";
import { Button } from "@/components/ui/Button";

interface AddToTripButtonProps {
  place: Place;
}

export function AddToTripButton({ place }: AddToTripButtonProps) {
  const { userTrips, createTrip, addPlaceToTrip } = useTrips();
  const [isOpen, setIsOpen] = useState(false);
  const [addedTripId, setAddedTripId] = useState<string | null>(null);
  const [newTripTitle, setNewTripTitle] = useState("");
  const [showNewTripInput, setShowNewTripInput] = useState(false);

  const handleAddToTrip = (tripId: string) => {
    addPlaceToTrip(tripId, place);
    setAddedTripId(tripId);
    setTimeout(() => {
      setAddedTripId(null);
      setIsOpen(false);
    }, 1200);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;
    const newTrip = createTrip(newTripTitle, "ทริปส่วนตัว");
    addPlaceToTrip(newTrip.id, place);
    setNewTripTitle("");
    setShowNewTripInput(false);
    setAddedTripId(newTrip.id);
    setTimeout(() => {
      setAddedTripId(null);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
        title="เพิ่มลงในทริปท่องเที่ยว"
      >
        <CalendarDays className="h-4 w-4 text-emerald-600" />
        <span>เพิ่มลงทริป</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-5 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">เพิ่มลงในทริปท่องเที่ยว</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{place.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-3 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {userTrips.length === 0 && !showNewTripInput && (
                <div className="py-4 text-center">
                  <p className="text-xs text-slate-500 mb-3">คุณยังไม่มีทริปท่องเที่ยว</p>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setShowNewTripInput(true)}
                    className="w-full text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    <span>สร้างทริปแรกเพื่อบันทึก</span>
                  </Button>
                </div>
              )}

              {userTrips.map((trip) => {
                const isAdded = trip.items.some((i) => i.placeId === place.id);
                const isJustAdded = addedTripId === trip.id;

                return (
                  <button
                    key={trip.id}
                    type="button"
                    onClick={() => handleAddToTrip(trip.id)}
                    disabled={isAdded || isJustAdded}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isJustAdded
                        ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                        : isAdded
                        ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="text-xs font-bold truncate text-slate-800">{trip.title}</div>
                      <div className="text-[10px] text-slate-400">{trip.items.length} สถานที่</div>
                    </div>

                    <div className="shrink-0">
                      {isJustAdded ? (
                        <span className="flex items-center text-xs font-bold text-emerald-700">
                          <Check className="h-4 w-4 mr-1" />
                          เพิ่มแล้ว
                        </span>
                      ) : isAdded ? (
                        <span className="text-[10px] font-semibold text-slate-400">อยู่ในทริปแล้ว</span>
                      ) : (
                        <span className="flex items-center text-xs font-semibold text-emerald-600">
                          <Plus className="h-3.5 w-3.5 mr-0.5" />
                          เลือก
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Create Trip Input */}
            {showNewTripInput ? (
              <form onSubmit={handleCreateAndAdd} className="pt-2 border-t border-slate-100 space-y-2">
                <input
                  type="text"
                  placeholder="ตั้งชื่อทริปใหม่..."
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs focus:border-emerald-500 focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewTripInput(false)}
                    className="flex-1 text-xs h-8"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!newTripTitle.trim()}
                    className="flex-1 text-xs h-8"
                  >
                    สร้างและเพิ่มทันที
                  </Button>
                </div>
              </form>
            ) : userTrips.length > 0 ? (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTripInput(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>สร้างทริปใหม่</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
