import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getDemoUserFromCookieValue } from "@/lib/auth/demo-user";

// Helper with timeout to prevent middleware hanging
async function getUserWithTimeout(supabase: ReturnType<typeof createServerClient>, timeoutMs = 1500) {
  try {
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: { user: null }, error: new Error("Auth timeout") }), timeoutMs)
    );
    const authPromise = supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
    const result = await Promise.race([authPromise, timeoutPromise]);
    return result.data?.user || null;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const allCookies = request.cookies.getAll();
  const demoCookie = request.cookies.get("demo_user");
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith("sb-") || c.name.includes("auth-token")
  );

  let user = null;

  if (demoCookie?.value) {
    const parsedDemoUser = getDemoUserFromCookieValue(demoCookie.value);
    if (parsedDemoUser) {
      user = parsedDemoUser;
    } else {
      user = { id: "demo-user-id", email: "traveler@nakhonnayok.app", user_metadata: { full_name: "นักเดินทางทดสอบ" } };
    }
  } else if (hasAuthCookie) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    user = await getUserWithTimeout(supabase, 1500);
  }

  const { pathname } = request.nextUrl;

  // Protected routes: if not logged in, redirect to /login
  const isProtectedRoute = pathname.startsWith("/profile");
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Auth routes: if already logged in, redirect away from /login and /register
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
