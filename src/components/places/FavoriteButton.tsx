"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { Place } from "@/types/database";

const FAVORITES_STORAGE_KEY = "nakhon_nayok_favorites";
const FAVORITES_EVENT = "nakhon_nayok_favorites_updated";
const EMPTY_FAVORITES: string[] = [];

function subscribeFavorites(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (e: StorageEvent) => {
    if (e.key === FAVORITES_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

let cachedRaw: string | null = null;
let cachedSlugs: string[] = [];

function getFavoritesSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_FAVORITES;
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSlugs = raw ? (JSON.parse(raw) as string[]) : [];
    }
  } catch {
    cachedSlugs = [];
  }
  return cachedSlugs;
}

function getServerFavoritesSnapshot(): string[] {
  return EMPTY_FAVORITES;
}

export function FavoriteButton({ place }: { place: Place }) {
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot
  );
  const isFavorite = favorites.includes(place.slug);

  const toggleFavorite = () => {
    if (typeof window === "undefined") return;

    try {
      const current = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]") as string[];
      const next = isFavorite
        ? current.filter((slug) => slug !== place.slug)
        : [...new Set([...current, place.slug])];

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
    } catch {
      // ignore unavailable storage
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition-all ${
        isFavorite
          ? "border-rose-200 bg-rose-50 text-rose-700 shadow-sm"
          : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50"
      }`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-500"}`} />
      <span>{isFavorite ? "บันทึกไว้แล้ว" : "บันทึกเป็น favorite"}</span>
    </button>
  );
}
