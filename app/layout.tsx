import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryClientWrapper from "@/components/QuertWrapper";

const productSans = localFont({
  src: [
    {
      path: "./fonts/product-sans/Product Sans Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/product-sans/Product Sans Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/product-sans/Product Sans Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/product-sans/Product Sans Bold Italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-product-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vemre",
  description: "Vemre",
  generator: "vemre",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={productSans.variable}>
        <QueryClientWrapper>
          {children}
        </QueryClientWrapper>
      </body>
    </html>
  );
}
