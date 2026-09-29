import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const signOutPromise = supabase.auth.signOut();
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 800));
    await Promise.race([signOutPromise, timeoutPromise]);
  } catch {
    // Ignore sign out error
  }

  const cookieStore = await cookies();
  cookieStore.delete("demo_user");

  const requestUrl = new URL(request.url);
  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    status: 302,
  });
}
