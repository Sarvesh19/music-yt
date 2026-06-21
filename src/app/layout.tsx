import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/lib/player-context";
import { LibraryProvider } from "@/lib/library-context";
import PlayerBar from "@/components/PlayerBar";
import NavShell from "@/components/NavShell";

export const metadata: Metadata = {
  title: "MelodiX - Music Streaming",
  description: "Free music streaming. Search and play any song.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-dvh flex flex-col bg-black text-white antialiased overflow-hidden">
        <LibraryProvider>
          <PlayerProvider>
            <NavShell>{children}</NavShell>
            <PlayerBar />
          </PlayerProvider>
        </LibraryProvider>
      </body>
    </html>
  );
}
