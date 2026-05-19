import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Membership Club dApp",
  description: "PBA Session 6 running project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f0f2f7] text-slate-900">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
