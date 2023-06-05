import { Button } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function NotFoundPage() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>
        <div className="relative max-h-[500px] pt-[68%]">
          <Image src="/404.png" layout="fill" alt="404 Image" />
        </div>
        <h1 className="mt-4 text-center text-4xl font-bold text-sky-700">
          Halaman Tidak Ditemukan
        </h1>
        <div className="flex justify-center">
          <Button
            type="primary"
            className="mx-auto mt-2 text-xl"
            onClick={() => router.replace("/")}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
