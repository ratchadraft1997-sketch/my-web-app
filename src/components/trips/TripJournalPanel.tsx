"use client";

import { useSyncExternalStore, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Heart, PenLine, Repeat, Sparkles, XCircle } from "lucide-react";
import { TripPlan } from "@/types/trip";

interface JournalEntry {
  id: string;
  feeling: string;
  review: string;
  repeat: string;
  avoid: string;
  photo?: string;
  createdAt: string;
}

const STORAGE_PREFIX = "nakhon_nayok_trip_journal_";
const JOURNAL_EVENT = "nakhon_nayok_journal_updated";
const EMPTY_ENTRIES: JournalEntry[] = [];
const journalSnapshotCache = new Map<string, { raw: string | null; entries: JournalEntry[] }>();

function getJournalEntries(storageKey: string) {
  if (typeof window === "undefined") return EMPTY_ENTRIES;

  const raw = localStorage.getItem(storageKey);
  const cached = journalSnapshotCache.get(storageKey);
  if (cached?.raw === raw) return cached.entries;

  let entries = EMPTY_ENTRIES;
  if (raw) {
    try {
      entries = JSON.parse(raw) as JournalEntry[];
    } catch {
      entries = EMPTY_ENTRIES;
    }
  }

  journalSnapshotCache.set(storageKey, { raw, entries });
  return entries;
}

function subscribeJournal(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (e: StorageEvent) => {
    if (e.key?.startsWith(STORAGE_PREFIX)) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(JOURNAL_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(JOURNAL_EVENT, callback);
  };
}

export function TripJournalPanel({ trip }: { trip: TripPlan }) {
  const storageKey = `${STORAGE_PREFIX}${trip.id}`;
  const entries = useSyncExternalStore(
    subscribeJournal,
    () => getJournalEntries(storageKey),
    () => EMPTY_ENTRIES
  );

  const [feeling, setFeeling] = useState("");
  const [review, setReview] = useState("");
  const [repeat, setRepeat] = useState("");
  const [avoid, setAvoid] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const persistEntries = (nextEntries: JournalEntry[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(nextEntries));
    window.dispatchEvent(new CustomEvent(JOURNAL_EVENT));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(typeof reader.result === "string" ? reader.result : undefined);
    };
    reader.readAsDataURL(file);
  };

  const submitEntry = () => {
    const trimmedFeeling = feeling.trim();
    const trimmedReview = review.trim();
    if (!trimmedFeeling && !trimmedReview) return;

    const nextEntry: JournalEntry = {
      id: `journal-${Date.now()}`,
      feeling: trimmedFeeling || "ประทับใจ",
      review: trimmedReview || "บรรยากาศดีมาก",
      repeat: repeat.trim() || "อยากกลับไปอีก",
      avoid: avoid.trim() || "ไม่มีอะไรอยากแก้",
      photo,
      createdAt: new Date().toISOString(),
    };

    const nextEntries = [nextEntry, ...entries];
    persistEntries(nextEntries);
    setFeeling("");
    setReview("");
    setRepeat("");
    setAvoid("");
    setPhoto(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Travel Journal</h3>
          <p className="text-[11px] text-slate-500">บันทึกความรู้สึกหลังทำทริปเสร็จ</p>
        </div>
        <div className="rounded-full bg-amber-50 p-2 text-amber-600">
          <PenLine className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <label className="block text-xs font-semibold text-slate-700">
          ความรู้สึกหลังเที่ยว
          <textarea
            rows={2}
            value={feeling}
            onChange={(event) => setFeeling(event.target.value)}
            placeholder="เช่น ดีมาก สนุก บรรยากาศดีมาก"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <label className="block text-xs font-semibold text-slate-700">
          รีวิวสั้น / ความประทับใจ
          <textarea
            rows={3}
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="บรรยายว่าเพลิดเพลินและควรกลับไปอีก"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-slate-700">
            อยากทำอีกครั้ง
            <input
              value={repeat}
              onChange={(event) => setRepeat(event.target.value)}
              placeholder="เช่น ล่องแก่ง / ชมวิว"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-700">
            ไม่ควรทำอีก
            <input
              value={avoid}
              onChange={(event) => setAvoid(event.target.value)}
              placeholder="เช่น ไม่ควรไปตอนบ่ายแดดจัด"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Camera className="h-4 w-4 text-emerald-600" />
            รูปภาพสถานที่
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700"
          >
            {photo ? "เปลี่ยนรูป" : "เพิ่มรูป"}
          </button>
        </div>

        {photo && (
          <div className="relative h-32 w-full">
            <Image
              src={photo}
              alt="Journal upload preview"
              fill
              className="rounded-2xl object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={submitEntry}
          className="w-full rounded-2xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800"
        >
          บันทึกความทรงจำ
        </button>
      </div>

      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {entry.photo && (
                <div className="relative mb-2 h-36 w-full">
                  <Image
                    src={entry.photo}
                    alt="Trip memory"
                    fill
                    className="rounded-xl object-cover"
                  />
                </div>
              )}
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Heart className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                  <span className="font-bold">{entry.feeling}</span>
                </div>
                <p className="leading-relaxed">{entry.review}</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>อยากทำอีก: {entry.repeat || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <XCircle className="h-3.5 w-3.5 text-rose-500" />
                  <span>ไม่ควรทำอีก: {entry.avoid || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Repeat className="h-3 w-3" />
                  <span>{new Date(entry.createdAt).toLocaleDateString("th-TH", { dateStyle: "medium" })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
