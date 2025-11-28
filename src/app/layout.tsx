import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CartDrawerWrapper from "@/components/CartDrawerWrapper";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Online Store",
  description: "Your one stop shop for fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className={`${outfit.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <CartDrawerWrapper>
            {children}
          </CartDrawerWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
