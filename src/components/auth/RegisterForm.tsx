"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, AlertCircle, CheckCircle2, UserCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildDemoUser } from "@/lib/auth/demo-user";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { mapAuthErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterInput>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleDemoRegister = () => {
    setIsDemoLoading(true);
    setErrorMessage(null);

    const demoUser = buildDemoUser(
      formData.email.trim() || undefined,
      formData.fullName.trim() || undefined
    );

    const expires = new Date(Date.now() + 7 * 86400 * 1000);
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `demo_user=${encodeURIComponent(JSON.stringify(demoUser))}; path=/; expires=${expires.toUTCString()}; SameSite=Lax${secureFlag}`;

    router.replace("/profile");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    // Validate with Zod
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      });

      if (error) {
        setErrorMessage(mapAuthErrorMessage(error.message));
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        router.push("/profile");
        router.refresh();
      } else {
        setSuccessMessage("สมัครสมาชิกสำเร็จแล้ว กรุณาตรวจสอบอีเมลและกดลิงก์ยืนยันก่อนเข้าสู่ระบบ");
        setIsLoading(false);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสมัครสมาชิก";
      setErrorMessage(mapAuthErrorMessage(msg));
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDemoRegister}
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>สมัครและเข้าใช้งานในโหมดทดลองทันที</span>
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        <Input
          label="ชื่อ - นามสกุล"
          name="fullName"
          type="text"
          placeholder="สมชาย ใจดี"
          autoComplete="name"
          value={formData.fullName}
          onChange={handleChange}
          error={fieldErrors.fullName}
          disabled={isLoading || isDemoLoading}
        />

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
          placeholder="อย่างน้อย 6 ตัวอักษร"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={isLoading || isDemoLoading}
        />

        <Input
          label="ยืนยันรหัสผ่าน"
          name="confirmPassword"
          type="password"
          placeholder="พิมพ์รหัสผ่านอีกครั้ง"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          disabled={isLoading || isDemoLoading}
        />

        <Button
          type="submit"
          className="w-full mt-2 h-11 text-xs shadow-md"
          isLoading={isLoading}
          disabled={isDemoLoading}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          สมัครสมาชิกด้วย Supabase
        </Button>
      </form>

      {/* Quick Demo Register Option */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-50 px-2 text-slate-400 font-medium">หรือ</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleDemoRegister}
        isLoading={isDemoLoading}
        disabled={isLoading}
        className="w-full h-11 text-xs border-emerald-300 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100/70"
      >
        <UserCheck className="mr-2 h-4 w-4 text-emerald-600" />
        ทดลองใช้งานโดยไม่ต้องต่อฐานข้อมูล (Instant Demo)
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
