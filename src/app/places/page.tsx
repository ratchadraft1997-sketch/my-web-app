import { Suspense } from "react";
import { Metadata } from "next";
import { Compass, SearchX } from "lucide-react";
import { getPlaces } from "@/lib/services/places";
import { getCategories } from "@/lib/services/categories";
import { PlaceCard } from "@/components/places/PlaceCard";
import { CategoryFilter } from "@/components/places/CategoryFilter";
import { PlaceSearchBar } from "@/components/places/PlaceSearchBar";
import { VibeFilter } from "@/components/places/VibeFilter";

export const metadata: Metadata = {
  title: "สำรวจสถานที่ท่องเที่ยว | Nakhon Nayok Trip",
  description: "ค้นพบน้ำตก ภูเขา วัด คาเฟ่ และสถานที่ท่องเที่ยวยอดนิยมในจังหวัดนครนายก",
};

interface PlacesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    vibe?: string;
  }>;
}

export default async function PlacesPage({ searchParams }: PlacesPageProps) {
  const { category, q, vibe } = await searchParams;

  const [places, categories] = await Promise.all([
    getPlaces({
      categorySlug: category,
      query: q,
      vibe,
    }),
    getCategories(),
  ]);

  return (
    <div className="space-y-4 py-4">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
          <Compass className="h-4 w-4" />
          <span>สำรวจนครนายก</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          {category && category !== "all"
            ? categories.find((c) => c.slug === category)?.name || "สถานที่ท่องเที่ยว"
            : "สถานที่ท่องเที่ยวทั้งหมด"}
        </h1>
        <p className="text-xs text-slate-500">
          ค้นพบจุดเช็คอินธรรมชาติ คาเฟ่ และวัฒนธรรมในนครนายก
        </p>
      </div>

      {/* Search Bar */}
      <Suspense fallback={<div className="h-11 w-full animate-pulse rounded-2xl bg-slate-100" />}>
        <PlaceSearchBar />
      </Suspense>

      {/* Category Chips */}
      <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-full bg-slate-100" />}>
        <CategoryFilter categories={categories} selectedCategory={category || "all"} />
      </Suspense>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Search by vibe
          </span>
        </div>
        <Suspense fallback={<div className="h-9 w-full animate-pulse rounded-full bg-slate-100" />}>
          <VibeFilter selectedVibe={vibe} />
        </Suspense>
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold text-slate-600">
          พบทั้งหมด <span className="text-emerald-600 font-bold">{places.length}</span> แห่ง
        </span>
        {(q || vibe) && (
          <span className="text-xs text-slate-400">
            {q ? `คำค้นหา: "${q}"` : ""}
            {q && vibe ? " • " : ""}
            {vibe ? `สไตล์: ${vibe}` : ""}
          </span>
        )}
      </div>

      {/* Places List / Grid */}
      {places.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
            <SearchX className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">ไม่พบสถานที่ที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูสถานที่น่าสนใจ
          </p>
        </div>
      )}
    </div>
  );
}
