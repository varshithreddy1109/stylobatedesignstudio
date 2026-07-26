"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { supabase } from "@/lib/supabase/client";

function friendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("invalid login credentials")) {
      return "Incorrect email or password. Please try again.";
    }
    if (message.includes("email not confirmed")) {
      return "This email address hasn't been confirmed yet. Check your inbox for a confirmation link.";
    }
    if (message.includes("failed to fetch") || message.includes("network")) {
      return "Network error — please check your connection and try again.";
    }
    return error.message;
  }
  return "Something went wrong while signing in. Please try again.";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If a valid session already exists, skip the login form entirely.
  // (src/middleware.ts also enforces this server-side on every request —
  // this client-side check just avoids a flash of the form on soft navigation.)
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        router.replace("/admin/dashboard");
        return;
      }
      setCheckingSession(false);
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setFormError(friendlyErrorMessage(error));
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-ink text-paper">
        <div className="flex flex-col items-center gap-5">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-brass" />
          <p className="label-tag text-stone">Checking session…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 py-32 text-paper">
      <span className="blueprint-corner left-6 top-8 hidden text-stone/50 md:block">D1</span>
      <span className="blueprint-corner right-6 bottom-8 hidden text-stone/50 md:block">D2</span>

      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex">
            <Logo height={120} className="h-16 w-auto md:h-20" />
          </Link>
          <p className="mt-3 label-tag text-brass-light">Admin Access</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-6 border border-white/15 bg-paper/[0.03] p-8 backdrop-blur-sm md:p-10"
        >
          {formError && (
            <div className="border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              className="border-b border-white/20 bg-transparent py-3 text-sm text-paper outline-none transition-colors duration-300 focus:border-brass"
              placeholder="you@stylobatedesignstudio.com"
            />
            {fieldErrors.email && <span className="text-xs text-red-300">{fieldErrors.email}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-mono text-[11px] uppercase tracking-widest2 text-stone">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              className="border-b border-white/20 bg-transparent py-3 text-sm text-paper outline-none transition-colors duration-300 focus:border-brass"
              placeholder="••••••••"
            />
            {fieldErrors.password && <span className="text-xs text-red-300">{fieldErrors.password}</span>}
          </div>

          <div className="flex items-center justify-between text-xs text-stone">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-3.5 w-3.5 accent-brass" />
              Remember me
            </label>
            <span className="cursor-not-allowed text-stone/60">Forgot password?</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="!bg-brass !text-ink !border-brass hover:!bg-brass-light hover:!border-brass-light disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-stone">
          <Link href="/" className="underline decoration-stone/40 underline-offset-4 hover:text-paper">
            ← Back to website
          </Link>
        </p>
      </div>
    </section>
  );
}
