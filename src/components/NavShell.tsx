"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function NavShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const close = () => setSidebarOpen(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full w-72 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 h-14 bg-neutral-900 border-b border-neutral-800">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-white text-xl p-1"
          aria-label="Open menu"
        >
          ☰
        </button>
        <span className="text-lg font-bold text-white">MelodiX</span>
      </div>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={close} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900 to-black pt-14 lg:pt-0 overflow-x-hidden pb-16 sm:pb-[72px]">
        <div className="px-3 sm:px-6 py-3 sm:py-6">{children}</div>
      </main>
    </>
  );
}
