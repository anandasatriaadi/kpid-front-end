import { Button, message, UploadFile } from "antd";
import type { UploadProps } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { RcFile } from "antd/lib/upload";

const Home: NextPage = () => {
  const [uploadFile, setUploadFile] = useState<UploadFile>()
  const [uploading, setUploading] = useState<Boolean>(false)

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", uploadFile as RcFile);
    setUploading(true);
    // You can use any AJAX library you like
    fetch("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setUploadFile(undefined);
        message.success("upload successfully.");
      })
      .catch(() => {
        message.error("upload failed.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const fileDropProps: UploadProps = {
    name: "file",
    maxCount: 1,
    beforeUpload: file => {
      setUploadFile(file)
      return false;
    }
  };

  return (
    <div>
      <Head>
        <title>Moderasi Video | KPID Jawa Timur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto">
        <Navbar />
        <div className="p-4">
          <div className="flex justify-center">
            <div className="md:text-center md:w-1/2">
              <h1 className="text-lg font-semibold">
                Moderasi Video oleh KPID
              </h1>
              <p className="text-sm text-gray-500">
                KPID Jawa Timur menyediakan layanan moderasi video untuk
                memastikan bahwa video yang disiarkan sesuai dengan standar KPID
                Jawa Timur.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full md:w-3/4 mt-8 p-4 rounded-md shadow-lg bg-sky-50">
              <Dragger
                {...fileDropProps}
                className="flex justify-center items-center h-[15rem] rounded-md border-2 border-dashed border-gray-400 bg-transparent"
              >
                <div className="flex flex-col">
                  <div className="flex justify-center">
                    <span className="p-4 rounded-full bg-sky-500"></span>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="primary"
                      className="flex items-center mt-2"
                      icon={
                        <span className="rounded-full bg-sky-100 p-2 mr-2 h-auto" />
                      }
                    >
                      Pilih Video
                    </Button>
                  </div>
                  <span className="mt-2">atau letakkan video anda disini</span>
                </div>
              </Dragger>
              <div className="flex justify-end mt-4">
                <Button type="primary" onClick={handleUpload}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;