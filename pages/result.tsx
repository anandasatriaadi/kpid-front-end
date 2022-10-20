import { Button, Collapse, Divider, Empty, Timeline } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import ResultCard from "../components/ResultCard";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Moderasi Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <Navbar />
        <div>
          <h1 className="text-lg font-semibold mx-4">Hasil Moderasi</h1>
          <ResultCard />
          <ResultCard />
          <ResultCard />
        </div>
      </div>
    </div>
  );
};

export default Home;
