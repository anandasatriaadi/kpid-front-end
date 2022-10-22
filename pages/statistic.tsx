import { Button } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../components/ChartCard";

const chart1 = {
  title: "Moderasi Bulanan",
  key1: "Total Video",
  key2: "Moderated Video",
  data: [
    { name: 1, "Total Video": 68, "Moderated Video": 37 },
    { name: 2, "Total Video": 90, "Moderated Video": 7 },
    { name: 3, "Total Video": 84, "Moderated Video": 47 },
    { name: 4, "Total Video": 12, "Moderated Video": 5 },
    { name: 5, "Total Video": 28, "Moderated Video": 1 },
    { name: 6, "Total Video": 47, "Moderated Video": 43 },
    { name: 7, "Total Video": 59, "Moderated Video": 15 },
    { name: 8, "Total Video": 68, "Moderated Video": 7 },
    { name: 9, "Total Video": 88, "Moderated Video": 26 },
    { name: 10, "Total Video": 44, "Moderated Video": 10 },
    { name: 11, "Total Video": 30, "Moderated Video": 16 },
    { name: 12, "Total Video": 49, "Moderated Video": 7 },
    { name: 13, "Total Video": 96, "Moderated Video": 15 },
    { name: 14, "Total Video": 11, "Moderated Video": 5 },
    { name: 15, "Total Video": 96, "Moderated Video": 6 },
    { name: 16, "Total Video": 82, "Moderated Video": 9 },
    { name: 17, "Total Video": 89, "Moderated Video": 33 },
    { name: 18, "Total Video": 43, "Moderated Video": 3 },
    { name: 19, "Total Video": 87, "Moderated Video": 53 },
    { name: 20, "Total Video": 31, "Moderated Video": 14 },
    { name: 21, "Total Video": 76, "Moderated Video": 67 },
    { name: 22, "Total Video": 95, "Moderated Video": 16 },
    { name: 23, "Total Video": 27, "Moderated Video": 8 },
    { name: 24, "Total Video": 93, "Moderated Video": 43 },
    { name: 25, "Total Video": 9, "Moderated Video": 6 },
    { name: 26, "Total Video": 13, "Moderated Video": 7 },
    { name: 27, "Total Video": 84, "Moderated Video": 21 },
    { name: 28, "Total Video": 8, "Moderated Video": 6 },
    { name: 29, "Total Video": 18, "Moderated Video": 2 },
    { name: 30, "Total Video": 38, "Moderated Video": 15 },
  ],
};
const chart2 = {
  title: "Statistik Pengguna Unik",
  key1: "Total Pengguna",
  data: [
    { name: 1, "Total Pengguna": 37 },
    { name: 2, "Total Pengguna": 7 },
    { name: 3, "Total Pengguna": 47 },
    { name: 4, "Total Pengguna": 5 },
    { name: 5, "Total Pengguna": 1 },
    { name: 6, "Total Pengguna": 43 },
    { name: 7, "Total Pengguna": 15 },
    { name: 8, "Total Pengguna": 7 },
    { name: 9, "Total Pengguna": 26 },
    { name: 10, "Total Pengguna": 10 },
    { name: 11, "Total Pengguna": 16 },
    { name: 12, "Total Pengguna": 7 },
    { name: 13, "Total Pengguna": 15 },
    { name: 14, "Total Pengguna": 5 },
    { name: 15, "Total Pengguna": 6 },
    { name: 16, "Total Pengguna": 9 },
    { name: 17, "Total Pengguna": 33 },
    { name: 18, "Total Pengguna": 3 },
    { name: 19, "Total Pengguna": 53 },
    { name: 20, "Total Pengguna": 14 },
    { name: 21, "Total Pengguna": 67 },
    { name: 22, "Total Pengguna": 16 },
    { name: 23, "Total Pengguna": 8 },
    { name: 24, "Total Pengguna": 43 },
    { name: 25, "Total Pengguna": 6 },
    { name: 26, "Total Pengguna": 7 },
    { name: 27, "Total Pengguna": 21 },
    { name: 28, "Total Pengguna": 6 },
    { name: 29, "Total Pengguna": 2 },
    { name: 30, "Total Pengguna": 15 },
  ],
};

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Statistik Moderasi | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <Navbar />
        <div className="flex flex-wrap">
          <ChartCard chartData={chart1} title={chart1.title}></ChartCard>
          <ChartCard chartData={chart2} title={chart2.title}></ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Home;
