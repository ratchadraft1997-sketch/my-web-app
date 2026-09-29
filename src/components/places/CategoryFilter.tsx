"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Category } from "@/types/database";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory = "all",
}: CategoryFilterProps) {
  const searchParams = useSearchParams();

  const buildHref = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    const queryString = params.toString();
    return queryString ? `/places?${queryString}` : "/places";
  };

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      <Link
        href={buildHref("all")}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all active:scale-95",
          selectedCategory === "all" || !selectedCategory
            ? "bg-emerald-600 text-white shadow-sm"
            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
        )}
      >
        <span>🌟</span>
        <span>ทั้งหมด</span>
      </Link>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <Link
            key={cat.id}
            href={buildHref(cat.slug)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all active:scale-95",
              isSelected
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
