import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Bread of Life Church",
  description: "Welcome to Bread of Life Church. Join us for worship, prayer, and community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
