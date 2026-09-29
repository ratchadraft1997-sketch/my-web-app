"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, LogIn, Sparkles, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildDemoUser } from "@/lib/auth/demo-user";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { mapAuthErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/profile";

  const [formData, setFormData] = useState<LoginInput>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const destination = redirectPath.startsWith("/") && !redirectPath.startsWith("//")
    ? redirectPath
    : "/profile";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: "" }));
    setErrorMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({
        email: validation.data.email.trim(),
        password: validation.data.password,
      });
      if (error) {
        setErrorMessage(mapAuthErrorMessage(error.message));
        return;
      }

      router.replace(destination);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "ไม่สามารถเข้าสู่ระบบได้";
      setErrorMessage(mapAuthErrorMessage(message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsDemoLoading(true);
    setErrorMessage(null);

    const demoUser = buildDemoUser("traveler@nakhonnayok.app", "นักเดินทางนครนายก");
    const expires = new Date(Date.now() + 7 * 86400 * 1000);
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `demo_user=${encodeURIComponent(JSON.stringify(demoUser))}; path=/; expires=${expires.toUTCString()}; SameSite=Lax${secureFlag}`;

    router.replace(destination);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="อีเมล"
          name="email"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={isLoading || isDemoLoading}
        />
        <Input
          label="รหัสผ่าน"
          name="password"
          type="password"
          placeholder="รหัสผ่านของคุณ"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={isLoading || isDemoLoading}
        />
        <Button type="submit" isLoading={isLoading} disabled={isDemoLoading} className="w-full h-11 text-xs shadow-md">
          <LogIn className="mr-2 h-4 w-4" />
          เข้าสู่ระบบด้วยอีเมล
        </Button>
      </form>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-400 font-medium">หรือ</span></div>
      </div>

      <Button
        type="button"
        onClick={handleDemoLogin}
        isLoading={isDemoLoading}
        disabled={isLoading}
        className="w-full h-14 sm:h-12 text-sm sm:text-xs font-semibold shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
      >
        <UserCheck className="mr-2 h-5 sm:h-4 w-5 sm:w-4 text-white" />
        เข้าสู่ระบบด้วยบัญชีทดลอง
      </Button>

      <div className="pt-1 text-center">
        <p className="inline-flex items-center gap-1 text-[11px] text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          เข้าสู่ระบบแบบเร็วทันทีโดยไม่ต้องกรอกข้อมูล
        </p>
      </div>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          ยังไม่มีบัญชีผู้ใช้งาน?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
