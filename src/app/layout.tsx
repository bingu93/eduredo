import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kurspräferenz – Dein Lern-Interessenprofil",
  description: "Wähle 12x den Kurs, der dich mehr interessiert.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
