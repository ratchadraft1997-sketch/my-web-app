import { createClient } from "@/lib/supabase/server";
import { Place } from "@/types/database";
import { FALLBACK_PLACES } from "@/lib/data/placesData";

export { FALLBACK_PLACES };

// Public pages must remain usable when the hosted database is unreachable.
// A short limit avoids holding the App Router loading state on a slow network.
const DATABASE_TIMEOUT_MS = 350;

export async function getPlaces(options?: {
  categorySlug?: string;
  query?: string;
  featuredOnly?: boolean;
vibe?: string;
}): Promise<Place[]> {  try {
    const supabase = await createClient();
    let queryBuilder = supabase
      .from("places")
      .select("*, category:categories(*)")
      .order("rating", { ascending: false });

    if (options?.featuredOnly) {
      queryBuilder = queryBuilder.eq("is_featured", true);
    }

    if (options?.query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${options.query}%,description.ilike.%${options.query}%,district.ilike.%${options.query}%`
      );
    }

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error("Places timeout") }), DATABASE_TIMEOUT_MS)
    );

    const { data, error } = await Promise.race([queryBuilder, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return filterFallbackPlaces(options);
    }

    let places = data as Place[];

    if (options?.categorySlug && options.categorySlug !== "all") {
      places = places.filter(
        (p) => p.category?.slug === options.categorySlug
      );
    }

    if (options?.vibe) {
      const vibe = options.vibe.trim().toLowerCase();
      places = places.filter((p) =>
        p.vibes?.some((item) => item.toLowerCase().includes(vibe))
      );
    }

    return places;
  } catch {
    return filterFallbackPlaces(options);
  }
}

function filterFallbackPlaces(options?: {
  categorySlug?: string;
  query?: string;
  featuredOnly?: boolean;
  vibe?: string;
}): Place[] {
  let result = [...FALLBACK_PLACES];

  if (options?.featuredOnly) {
    result = result.filter((p) => p.is_featured);
  }

  if (options?.categorySlug && options.categorySlug !== "all") {
    result = result.filter((p) => p.category?.slug === options.categorySlug);
  }

  if (options?.query) {
    const q = options.query.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.district && p.district.toLowerCase().includes(q))
    );
  }

  if (options?.vibe) {
    const vibe = options.vibe.trim().toLowerCase();
    result = result.filter((p) =>
      p.vibes?.some((item) => item.toLowerCase().includes(vibe))
    );
  }

  return result;
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  try {
    const supabase = await createClient();
    const queryPromise = supabase
      .from("places")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .single();

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error("Place timeout") }), DATABASE_TIMEOUT_MS)
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error || !data) {
      return FALLBACK_PLACES.find((p) => p.slug === slug) || null;
    }

    return data as Place;
  } catch {
    return FALLBACK_PLACES.find((p) => p.slug === slug) || null;
  }
}
