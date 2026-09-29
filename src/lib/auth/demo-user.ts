export type DemoUser = {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
    [key: string]: unknown;
  };
};

export function buildDemoUser(email?: string, fullName?: string): DemoUser {
  return {
    id: "demo-user-12345",
    email: email?.trim() || "traveler@nakhonnayok.app",
    created_at: new Date().toISOString(),
    user_metadata: {
      full_name: fullName?.trim() || "นักเดินทางนครนายก",
    },
  };
}

export function getDemoUserFromCookieValue(value?: string | null): DemoUser | null {
  if (!value) return null;

  try {
    const decodedValue = decodeURIComponent(value);
    const parsed = JSON.parse(decodedValue) as Partial<DemoUser>;

    if (!parsed || typeof parsed !== "object" || !parsed.email || !parsed.id) {
      return null;
    }

    return {
      id: String(parsed.id),
      email: String(parsed.email),
      created_at: parsed.created_at ? String(parsed.created_at) : new Date().toISOString(),
      user_metadata: {
        full_name:
          typeof parsed.user_metadata?.full_name === "string"
            ? parsed.user_metadata.full_name
            : "นักเดินทาง",
        ...(parsed.user_metadata ?? {}),
      },
    };
  } catch {
    return null;
  }
}
