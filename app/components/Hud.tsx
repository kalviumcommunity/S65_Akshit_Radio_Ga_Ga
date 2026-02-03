"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Hud() {
  const { data: session, status, update } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [name, setName] = useState(session?.user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const isAuthed = status === "authenticated";

  useEffect(() => {
    setName(session?.user?.name ?? "");
  }, [session?.user?.name]);

  const handleSaveName = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setIsSaving(true);
    try {
      await update({ name: trimmed });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {isAuthed ? (
          <>
            <button
              className="rounded bg-white/80 px-3 py-2 text-sm font-medium text-black hover:bg-white"
              onClick={() => setSettingsOpen((prev) => !prev)}
            >
              Settings
            </button>
            <button
              className="rounded bg-black/70 px-3 py-2 text-sm font-medium text-white hover:bg-black"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="rounded bg-white/90 px-3 py-2 text-sm font-semibold text-black hover:bg-white"
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
          >
            Sign in
          </button>
        )}
      </div>

      {isAuthed && settingsOpen ? (
        <div className="absolute top-16 right-4 z-10 w-72 rounded bg-black/70 p-4 text-white backdrop-blur">
          <h3 className="text-sm font-semibold">Settings</h3>
          <label className="mt-3 block text-xs text-white/70">
            Display name
          </label>
          <input
            className="mt-2 w-full rounded border border-white/20 bg-black/60 px-3 py-2 text-sm text-white outline-none focus:border-white/60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <button
            className="mt-3 w-full rounded bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
            onClick={handleSaveName}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <p className="mt-2 text-xs text-white/60">
            Signed in as {session?.user?.email}
          </p>
        </div>
      ) : null}

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-black">
        <span className="h-2 w-2 rounded-full bg-black" />
        RGG
      </div>
    </>
  );
}
