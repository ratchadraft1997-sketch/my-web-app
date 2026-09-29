import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types/database";
import { FALLBACK_CATEGORIES } from "@/lib/data/placesData";

export { FALLBACK_CATEGORIES };

const DATABASE_TIMEOUT_MS = 350;

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const queryPromise = supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error("Categories timeout") }), DATABASE_TIMEOUT_MS)
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return data as Category[];
  } catch {
    return FALLBACK_CATEGORIES;
  }
}
