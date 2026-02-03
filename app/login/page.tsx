"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials");
      return;
    }

    if (result?.ok) {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 to-white p-6 text-black">
      <div className="mx-auto mt-20 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-black/60">
          Use Google or your personal email and password.
        </p>

        <button
          className="mt-4 w-full rounded-lg border border-black/10 bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Continue with Google
        </button>

        <div className="my-5 h-px w-full bg-black/10" />

        <form className="space-y-3" onSubmit={handleCredentialsLogin}>
          <div>
            <label className="text-xs text-black/70">Email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-black/70">Password</label>
            <input
              type="password"
              className="mt-2 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
