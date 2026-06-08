import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/site-header";
import SubNavbar from "./components/sub-navbar";
import SiteFooter from "./components/site-footer";
import { getCurrentLanguage } from "./lib/api";

export const metadata: Metadata = {
  title: "CARDINAR",
  description: "Авточехлы и автомобильные аксессуары CARDINAR",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getCurrentLanguage();

  return (
    <html lang={lang} className="h-full antialiased">

      <body className="min-h-full flex flex-col">

        <SiteHeader />
        <SubNavbar />
        {children}
         <SiteFooter />
        </body>
     
    </html>
  );
}
