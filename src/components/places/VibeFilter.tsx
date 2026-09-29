"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const vibeOptions = [
  "ธรรมชาติ",
  "คาเฟ่",
  "ครอบครัว",
  "ผจญภัย",
  "ถ่ายรูปสวย",
  "สบายๆ",
];

interface VibeFilterProps {
  selectedVibe?: string;
}

export function VibeFilter({ selectedVibe }: VibeFilterProps) {
  const searchParams = useSearchParams();

  const buildHref = (vibe: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!vibe) {
      params.delete("vibe");
    } else {
      params.set("vibe", vibe);
    }

    const queryString = params.toString();
    return queryString ? `/places?${queryString}` : "/places";
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref(null)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all",
          !selectedVibe
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        )}
      >
        ทุกสไตล์
      </Link>
      {vibeOptions.map((vibe) => {
        const isSelected = selectedVibe === vibe;
        return (
          <Link
            key={vibe}
            href={buildHref(vibe)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all",
              isSelected
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            {vibe}
          </Link>
        );
      })}
    </div>
  );
}
