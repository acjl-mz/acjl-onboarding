import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACJL Onboarding",
  description: "Diagnóstico, dimensionamento e precificação de serviços ACJL"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
