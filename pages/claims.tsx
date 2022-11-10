import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Header from "../src/Components/Header";
import Claims from "../src/Components//Claims/Claims";

const Home: NextPage = () => {
  const { authenticate, logout, isAuthenticated, user } = useMoralis();
  const [auth, setAuth] = useState(true);

  const [userAddress, setUserAddress] = useState();
  const page = "/";

  useEffect(() => {
    if (user) {
      setUserAddress(
        user.get("ethAddress").slice(0, 6).concat("...") +
          user.get("ethAddress").slice(38, 44)
      );
    } else {
    }
  });

  // if (!isAuthenticated) return <Landing />;
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
        <Claims />
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
