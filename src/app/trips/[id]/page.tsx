"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Banknote,
  Sparkles,
  Navigation,
  Copy,
  Check,
  Trash2,
  MapPin,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { getCuratedTripById, generateGoogleMapsRouteUrl } from "@/lib/services/trips";
import { useTrips } from "@/lib/hooks/useTrips";
import { TripTimeline } from "@/components/trips/TripTimeline";
import { AddPlaceToTripModal } from "@/components/trips/AddPlaceToTripModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Place } from "@/types/database";
import { buildTripShareText, getTripBudgetSummary } from "@/lib/trip-planning";
import { TripJournalPanel } from "@/components/trips/TripJournalPanel";

export default function TripDetailPage() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || "";
  const router = useRouter();
  const {
    isLoaded,
    getTripById,
    toggleItemVisited,
    removePlaceFromTrip,
    addPlaceToTrip,
    duplicateCuratedTrip,
    deleteTrip,
    updateTripBudget,
    toggleChecklistItem,
  } = useTrips();

  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Derive trip directly from curated or user trips
  const curated = getCuratedTripById(id);
  const userTrip = !curated ? getTripById(id) : null;
  const trip = curated || userTrip;
  const isCurated = Boolean(curated);

  if (!trip && isLoaded) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-base font-bold text-slate-800">ไม่พบทริปท่องเที่ยวนี้</h2>
        <p className="text-xs text-slate-500">ทริปนี้อาจถูกลบไปแล้วหรือลิงก์ไม่ถูกต้อง</p>
        <Link href="/trips">
          <Button variant="primary" className="h-10 text-xs">
            กลับไปหน้ารวมทริป
          </Button>
        </Link>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-8 space-y-4">
        <div className="h-48 w-full animate-pulse rounded-3xl bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  const visitedCount = trip.items.filter((i) => i.visited).length;
  const totalStops = trip.items.length;
  const progressPercent =
    totalStops > 0 ? Math.round((visitedCount / totalStops) * 100) : 0;

  const handleDuplicate = () => {
    const newTrip = duplicateCuratedTrip(trip);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      router.push(`/trips/${newTrip.id}`);
    }, 800);
  };

  const handleDelete = () => {
    if (confirm("ต้องการลบทริปนี้ใช่หรือไม่?")) {
      deleteTrip(trip.id);
      router.push("/trips");
    }
  };

  const handleToggleVisited = (itemId: string) => {
    if (isCurated) {
      // If curated, duplicate to user trips first so state persists!
      const userCopy = duplicateCuratedTrip(trip);
      toggleItemVisited(userCopy.id, itemId);
      router.push(`/trips/${userCopy.id}`);
    } else {
      toggleItemVisited(trip.id, itemId);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (!isCurated) {
      removePlaceFromTrip(trip.id, itemId);
    }
  };

  const handleAddPlace = (
    place: Place,
    options?: { timeSlot?: string; note?: string }
  ) => {
    if (!isCurated) {
      addPlaceToTrip(trip.id, place, options);
    }
  };

  const googleMapsAllRouteUrl = generateGoogleMapsRouteUrl(trip.items);
  const tripBudget = getTripBudgetSummary(trip);
  const checklistItems = trip.checklist?.items ?? [];

  const handleBudgetSave = () => {
    if (isCurated) {
      const userCopy = duplicateCuratedTrip(trip);
      updateTripBudget(userCopy.id, {
        total: tripBudget.total,
        spent: tripBudget.spent,
        note: trip.budget?.note || "ยังไม่ได้ตั้งงบประมาณ",
      });
      router.push(`/trips/${userCopy.id}`);
      return;
    }

    const total = Number((document.getElementById("trip-budget-total") as HTMLInputElement | null)?.value ?? trip.budget?.total ?? 0);
    const spent = Number((document.getElementById("trip-budget-spent") as HTMLInputElement | null)?.value ?? trip.budget?.spent ?? 0);
    const note = (document.getElementById("trip-budget-note") as HTMLTextAreaElement | null)?.value ?? trip.budget?.note ?? "";
    updateTripBudget(trip.id, { total, spent, note });
  };

  const handleChecklistToggle = (itemId: string) => {
    if (isCurated) {
      const userCopy = duplicateCuratedTrip(trip);
      toggleChecklistItem(userCopy.id, itemId);
      router.push(`/trips/${userCopy.id}`);
      return;
    }

    toggleChecklistItem(trip.id, itemId);
  };

  const handleShareTrip = async () => {
    const shareText = buildTripShareText(trip);
    try {
      await navigator.clipboard.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1200);
    } catch {
      // no-op fallback
    }
  };

  return (
    <div className="space-y-5 pb-12 pt-2">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/trips"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-xs border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareTrip}
            className="h-9 px-3 text-xs shadow-xs bg-white text-slate-700"
          >
            {shareCopied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                <span>คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 mr-1 text-slate-500" />
                <span>แชร์ทริป</span>
              </>
            )}
          </Button>

          {isCurated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className={`h-9 px-3 text-xs shadow-xs transition-all ${copied
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-white text-slate-700"
                }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  <span>คัดลอกเข้าทริปแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  <span>คัดลอกไปปรับแต่ง</span>
                </>
              )}
            </Button>
          ) : (
            <button
              onClick={handleDelete}
              title="ลบทริปนี้"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-xs border border-slate-100 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-md sm:h-64">
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/20" />

        {/* Floating Content */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {isCurated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span>แผนแนะนำยอดนิยม</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>{trip.duration}</span>
            </span>
          </div>

          <h1 className="text-xl font-black text-white sm:text-2xl drop-shadow-md">
            {trip.title}
          </h1>
        </div>
      </div>

      {/* Overview & Quick Info Card */}
      <Card className="space-y-3">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {trip.description}
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
          {trip.estimatedBudget && (
            <div className="flex items-center gap-2 rounded-2xl bg-amber-50/70 p-2.5 text-xs text-amber-900 border border-amber-100">
              <Banknote className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] text-amber-700/80 block">งบประมาณแนะนำ</span>
                <span className="font-bold">{trip.estimatedBudget}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50/70 p-2.5 text-xs text-emerald-900 border border-emerald-100">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] text-emerald-700/80 block">จำนวนจุดแวะ</span>
              <span className="font-bold">{totalStops} สถานที่</span>
            </div>
          </div>
        </div>

        {trip.bestTimeToVisit && (
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-2xl">
            💡 <strong>ช่วงเวลาน่าเที่ยว:</strong> {trip.bestTimeToVisit}
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">งบประมาณและสิ่งที่ต้องเตรียม</h2>
            <p className="text-[11px] text-slate-500">ติดตามค่าใช้จ่ายและ checklist ก่อนออกเดินทาง</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3">
            <div className="text-[10px] uppercase tracking-wide text-amber-700">รวม</div>
            <div className="mt-1 text-base font-black text-amber-900">
              {tripBudget.total > 0 ? `${tripBudget.total.toLocaleString("th-TH")} ฿` : "—"}
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3">
            <div className="text-[10px] uppercase tracking-wide text-emerald-700">ใช้ไป</div>
            <div className="mt-1 text-base font-black text-emerald-900">
              {tripBudget.spent > 0 ? `${tripBudget.spent.toLocaleString("th-TH")} ฿` : "—"}
            </div>
          </div>
          <div className="rounded-2xl bg-sky-50 border border-sky-100 p-3">
            <div className="text-[10px] uppercase tracking-wide text-sky-700">เหลือ</div>
            <div className="mt-1 text-base font-black text-sky-900">
              {tripBudget.remaining > 0 ? `${tripBudget.remaining.toLocaleString("th-TH")} ฿` : "0 ฿"}
            </div>
          </div>
        </div>

        {!isCurated && (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs text-slate-600">
                <span className="font-semibold">งบประมาณรวม</span>
                <input
                  id="trip-budget-total"
                  type="number"
                  min={0}
                  defaultValue={trip.budget?.total ?? 0}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              <label className="space-y-1.5 text-xs text-slate-600">
                <span className="font-semibold">ใช้ไปแล้ว</span>
                <input
                  id="trip-budget-spent"
                  type="number"
                  min={0}
                  defaultValue={trip.budget?.spent ?? 0}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
            </div>
            <label className="space-y-1.5 block text-xs text-slate-600">
              <span className="font-semibold">หมายเหตุ</span>
              <textarea
                id="trip-budget-note"
                rows={2}
                defaultValue={trip.budget?.note ?? ""}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
            <Button variant="primary" className="h-10 text-xs" onClick={handleBudgetSave}>
              บันทึกงบประมาณ
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Checklist / Packing list</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "เสื้อผ้าชุดเดินทาง",
              "รองเท้าบู๊ตกันลื่น",
              "น้ำดื่ม",
              "หมวกกันแดด",
              "กล้อง / power bank",
            ].map((item) => (
              <span key={item} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                {item}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {checklistItems.length > 0 ? (
              checklistItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChecklistToggle(item.id)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left text-xs transition-all ${item.checked
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                    }`}
                >
                  <span>{item.label}</span>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${item.checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white text-slate-400"}`}>
                    {item.checked ? "✓" : ""}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400">ยังไม่มี checklist</p>
            )}
          </div>
        </div>
      </Card>

      <TripJournalPanel trip={trip} />

      {/* Route & Checklist Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">กำหนดการ & ลำดับเส้นทาง</h2>
            <p className="text-[11px] text-slate-500">
              {totalStops > 0
                ? `แวะแล้ว ${visitedCount} จาก ${totalStops} จุด (${progressPercent}%)`
                : "ยังไม่มีจุดแวะ"}
            </p>
          </div>

          {totalStops > 0 && (
            <a
              href={googleMapsAllRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>นำทางทั้งทริป</span>
            </a>
          )}
        </div>

        <TripTimeline
          items={trip.items}
          isEditable={!isCurated}
          onToggleVisited={handleToggleVisited}
          onRemoveItem={handleRemoveItem}
          onOpenAddPlace={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Add Place Modal */}
      {!isCurated && (
        <AddPlaceToTripModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          existingPlaceIds={trip.items.map((i) => i.placeId)}
          onAddPlace={handleAddPlace}
        />
      )}
    </div>
  );
}

