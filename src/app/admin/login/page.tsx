"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn.email({ email, password });

    if (signInError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-white">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-admin-gold)]" />
          <span className="text-lg font-semibold tracking-tight">PARVEX Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-2xl">
          <p className="mb-5 text-sm text-[var(--color-gray)]">
            Sign in to manage projects, services, media and enquiries.
          </p>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:border-neutral-400"
            />
          </label>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-[#0a0a0a] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/30">
          Authorized PARVEX team members only.
        </p>
      </div>
    </div>
  );
}
