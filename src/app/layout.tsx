import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dany Ruivo | Bolos e Tortas",
  description: "Sistema de pedidos online para Dany Ruivo - Bolos e Tortas.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body className={`${headingFont.variable} ${bodyFont.variable}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
