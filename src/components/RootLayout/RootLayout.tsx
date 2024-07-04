import Head from "next/head";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://plausible.trymanager.co/js/script.js";
    script.defer = true;
    script.setAttribute("data-domain", "trywatchd.com");
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>watchd: Conquer your watchlist(s)</title>
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}
