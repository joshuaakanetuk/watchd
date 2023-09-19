import Head from "next/head";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
