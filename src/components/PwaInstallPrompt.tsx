"use client";

import { useEffect, useState } from "react";

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    // Register service worker once on load
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // fail silently; app still works online
      });
  }, []);

  if (!visible || !deferredPrompt) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch {
      // prompt() can throw if already shown or not user-activated
    } finally {
      setDeferredPrompt(null);
      setVisible(false);
    }
  }

  function handleDismiss() {
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div className="max-w-md flex-1 rounded-2xl border border-white/20 bg-gradient-to-r from-[#0f172a]/95 via-[#111827]/95 to-[#0b1120]/95 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1297C9] to-[#E43786] shadow-[0_0_18px_rgba(18,151,201,0.7)]">
              <span className="text-xs font-bold tracking-tight text-white">KA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Install Kulmis Academy</p>
              <p className="mt-0.5 text-xs text-gray-300">
                Add Kulmis Academy to your device for a faster, app-like learning experience.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg border border-white/20 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:bg-white/10 smooth-transition"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={handleInstall}
              className="rounded-lg bg-gradient-to-r from-[#1297C9] to-[#E43786] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(18,151,201,0.8)] hover:brightness-110 btn-neon"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

