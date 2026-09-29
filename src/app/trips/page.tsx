"use client";

import { useState } from "react";
import {
  Compass,
  Sparkles,
  CalendarDays,
  Plus,
  FolderHeart,
} from "lucide-react";
import { getCuratedTrips } from "@/lib/services/trips";
import { useTrips } from "@/lib/hooks/useTrips";
import { CuratedTripCard } from "@/components/trips/CuratedTripCard";
import { MyTripCard } from "@/components/trips/MyTripCard";
import { CreateTripModal } from "@/components/trips/CreateTripModal";
import { Button } from "@/components/ui/Button";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState<"curated" | "my-trips">("curated");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const curatedTrips = getCuratedTrips();
  const { userTrips, isLoaded } = useTrips();

  return (
    <div className="space-y-5 py-4">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <CalendarDays className="h-4 w-4" />
            <span>วางแผนเที่ยวนครนายก</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">ทริปท่องเที่ยว</h1>
          <p className="text-xs text-slate-500 max-w-xs sm:max-w-md">
            เลือกแผนเที่ยวสำเร็จรูปยอดนิยม หรือสร้างทริปท่องเที่ยวของคุณเองได้ง่ายๆ
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 text-xs shadow-md shrink-0 rounded-2xl"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>สร้างทริปใหม่</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("curated")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "curated"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>แผนเที่ยวแนะนำ ({curatedTrips.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("my-trips")}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "my-trips"
              ? "bg-white text-emerald-800 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <FolderHeart className="h-3.5 w-3.5 text-emerald-600" />
          <span>ทริปของฉัน ({isLoaded ? userTrips.length : "..."})</span>
        </button>
      </div>

      {/* Curated Trips View */}
      {activeTab === "curated" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
            <Compass className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-800">แผนเที่ยวคัดสรรโดยคนท้องถิ่น</span>
              <p className="text-[11px] text-emerald-950/80 leading-relaxed">
                จัดเรียงลำดับเส้นทางและเวลาแวะที่เหมาะสมที่สุด สามารถกด &quot;คัดลอก&quot; เพื่อนำไปปรับแต่งตามใจคุณได้ทันที
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {curatedTrips.map((trip) => (
              <CuratedTripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      )}

      {/* My Trips View */}
      {activeTab === "my-trips" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          {!isLoaded ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 w-full animate-pulse rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          ) : userTrips.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {userTrips.map((trip) => (
                <MyTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <CalendarDays className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">ยังไม่มีทริปส่วนตัว</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1 mb-5 leading-relaxed">
                เริ่มสร้างทริปใหม่ หรือคัดลอกแผนเที่ยวแนะนำยอดนิยมเพื่อจัดตารางการเดินทาง
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 h-10 text-xs shadow-md"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <span>สร้างทริปใหม่</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("curated")}
                  className="flex-1 h-10 text-xs"
                >
                  <span>ดูแผนแนะนำ</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTripCreated={() => {
          setActiveTab("my-trips");
        }}
      />
    </div>
  );
}
