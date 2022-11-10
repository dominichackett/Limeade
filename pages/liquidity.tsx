import type { NextPage } from "next";
import Head from "next/head";
import { useMoralis } from "react-moralis";
import Landing from "../src/Components/Landing";
import Header from "../src/Components/Header";
import Liquidity from "../src/Components/Liquidity/Liquidity";

const Home: NextPage = () => {
  const { isAuthenticated } = useMoralis();

  if (!isAuthenticated) return <Landing />;
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-2">
      <Head>
        <title>LIMEADE</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Header />
      </div>

      <main className="flex w-full flex-1 flex-col items-center justify-center  text-center">
        <Liquidity />
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by LIMEADE
        </a>
      </footer>
    </div>
  );
};

export default Home;
