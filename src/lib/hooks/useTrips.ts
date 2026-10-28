"use client";

import { useSyncExternalStore } from "react";
import { TripPlan, TripPlaceItem } from "@/types/trip";
import { Place } from "@/types/database";
import { getDefaultChecklistItems } from "@/lib/trip-planning";

const STORAGE_KEY = "nakhon_nayok_user_trips";
const TRIPS_EVENT = "nakhon_nayok_trips_updated";
const EMPTY_TRIPS: TripPlan[] = [];

let cachedRaw: string | null = null;
let cachedTrips: TripPlan[] = [];

function getSnapshot(): TripPlan[] {
  if (typeof window === "undefined") return EMPTY_TRIPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedTrips = raw ? JSON.parse(raw) : [];
    }
  } catch {
    cachedTrips = [];
  }
  return cachedTrips;
}

function getServerSnapshot(): TripPlan[] {
  return EMPTY_TRIPS;
}

function getClientReadySnapshot(): boolean {
  return true;
}

function getServerReadySnapshot(): boolean {
  return false;
}

function subscribeToClientReady() {
  return () => {};
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(TRIPS_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(TRIPS_EVENT, handleCustomEvent);
  };
}

function saveTrips(trips: TripPlan[]) {
  try {
    const json = JSON.stringify(trips);
    localStorage.setItem(STORAGE_KEY, json);
    cachedRaw = json;
    cachedTrips = trips;
    window.dispatchEvent(new CustomEvent(TRIPS_EVENT));
  } catch (err) {
    console.error("Failed to save trips to localStorage:", err);
  }
}

export function useTrips() {
  const userTrips = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoaded = useSyncExternalStore(
    subscribeToClientReady,
    getClientReadySnapshot,
    getServerReadySnapshot
  );

  const createTrip = (title: string, description: string, duration?: string): TripPlan => {
    const newTrip: TripPlan = {
      id: `user-trip-${Date.now()}`,
      title: title.trim() || "ทริปเที่ยวนครนายกของฉัน",
      description: description.trim() || "แผนการท่องเที่ยวส่วนตัว",
      coverImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      duration: duration || "1 วัน (Day Trip)",
      tags: ["ทริปของฉัน", "ส่วนตัว"],
      isCurated: false,
      budget: {
        total: 0,
        spent: 0,
        note: "ยังไม่ได้ตั้งงบประมาณ",
      },
      checklist: {
        items: getDefaultChecklistItems(),
      },
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTrip, ...userTrips];
    saveTrips(updated);
    return newTrip;
  };

  const duplicateCuratedTrip = (curatedTrip: TripPlan): TripPlan => {
    const newTrip: TripPlan = {
      ...curatedTrip,
      id: `user-trip-${Date.now()}`,
      title: `(คัดลอก) ${curatedTrip.title}`,
      isCurated: false,
      tags: [...curatedTrip.tags, "คัดลอก"],
      budget: {
        total: curatedTrip.budget?.total ?? 0,
        spent: curatedTrip.budget?.spent ?? 0,
        note: curatedTrip.budget?.note || "ยังไม่ได้ตั้งงบประมาณ",
      },
      checklist: {
        items: (curatedTrip.checklist?.items ?? getDefaultChecklistItems()).map((item) => ({
          ...item,
          id: `${Date.now()}-${item.id}`,
        })),
      },
      items: curatedTrip.items.map((item) => ({
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        visited: false,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newTrip, ...userTrips];
    saveTrips(updated);
    return newTrip;
  };

  const updateTrip = (id: string, updates: Partial<TripPlan>) => {
    const updated = userTrips.map((trip) => {
      if (trip.id === id) {
        return {
          ...trip,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return trip;
    });
    saveTrips(updated);
  };

  const deleteTrip = (id: string) => {
    const updated = userTrips.filter((trip) => trip.id !== id);
    saveTrips(updated);
  };

  const addPlaceToTrip = (
    tripId: string,
    place: Place,
    options?: { timeSlot?: string; note?: string }
  ) => {
    const targetTrip = userTrips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const alreadyExists = targetTrip.items.some((i) => i.placeId === place.id);
    if (alreadyExists) return;

    const newItem: TripPlaceItem = {
      id: `item-${Date.now()}`,
      placeId: place.id,
      placeSlug: place.slug,
      placeName: place.name,
      coverImage: place.cover_image,
      categoryName: place.category?.name,
      categoryIcon: place.category?.icon || "📍",
      district: place.district || "เมืองนครนายก",
      timeSlot: options?.timeSlot || "",
      note: options?.note || "",
      visited: false,
      googleMapsUrl: place.google_maps_url || undefined,
    };

    const updatedItems = [...targetTrip.items, newItem];
    const coverImage = targetTrip.items.length === 0 ? place.cover_image : targetTrip.coverImage;

    updateTrip(tripId, {
      items: updatedItems,
      coverImage,
    });
  };

  const removePlaceFromTrip = (tripId: string, itemId: string) => {
    const targetTrip = userTrips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const updatedItems = targetTrip.items.filter((i) => i.id !== itemId);
    updateTrip(tripId, { items: updatedItems });
  };

  const toggleItemVisited = (tripId: string, itemId: string) => {
    const targetTrip = userTrips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const updatedItems = targetTrip.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, visited: !item.visited };
      }
      return item;
    });

    updateTrip(tripId, { items: updatedItems });
  };

  const updateTripBudget = (
    tripId: string,
    fields: { total?: number; spent?: number; note?: string }
  ) => {
    const targetTrip = userTrips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const currentBudget = targetTrip.budget ?? {
      total: 0,
      spent: 0,
      note: "ยังไม่ได้ตั้งงบประมาณ",
    };

    updateTrip(tripId, {
      budget: {
        total: fields.total ?? currentBudget.total ?? 0,
        spent: fields.spent ?? currentBudget.spent ?? 0,
        note: fields.note ?? currentBudget.note ?? "ยังไม่ได้ตั้งงบประมาณ",
      },
    });
  };

  const toggleChecklistItem = (tripId: string, itemId: string) => {
    const targetTrip = userTrips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const updatedItems = (targetTrip.checklist?.items ?? []).map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    updateTrip(tripId, {
      checklist: {
        items: updatedItems,
      },
    });
  };

  const getTripById = (id: string): TripPlan | null => {
    return userTrips.find((t) => t.id === id) || null;
  };

  return {
    userTrips,
    isLoaded,
    createTrip,
    updateTrip,
    deleteTrip,
    addPlaceToTrip,
    removePlaceFromTrip,
    toggleItemVisited,
    updateTripBudget,
    toggleChecklistItem,
    duplicateCuratedTrip,
    getTripById,
  };
}

