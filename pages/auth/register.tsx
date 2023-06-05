import AuthLayout from "@/components/AuthLayout";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import { Button, Divider, Form, Input, message } from "antd";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { NextPageWithLayout } from "@/pages/_app";
import { debounceLoadingMessage } from "@/utils/Debounce";

const Register: NextPageWithLayout = () => {
  //#region ::: Variable Initialisations
  const router = useRouter();
  const { isLoggedIn, register } = React.useContext(
    AuthContext
  ) as AuthContextInterface;

  // Other Hooks
  const [form] = Form.useForm();
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  const handleForm = (values: any) => {
    register(values);
  };

  const handleFormFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods

  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    if (isLoggedIn) {
      debounceLoadingMessage("Redirecting...");
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //#endregion ::: UseEffect

  const compareToFirstPassword = (_: any, value: any, callback: any) => {
    const { getFieldValue } = form;

    if (value && value !== getFieldValue("password")) {
      callback("Kata sandi tidak cocok!");
    } else {
      callback();
    }
  };

  return (
    <>
      <Head>
        <title>Register | KPID Jawa Timur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <div className="my-auto mx-auto max-w-[600px]">
          <div className="mx-auto mb-6 w-1/2 mix-blend-multiply md:w-2/5">
            <Link href={"/"}>
              <Image
                src={"/logo_kpid.png"}
                width={626}
                height={160}
                alt="Logo KPID Jawa Timur"
              />
            </Link>
          </div>
          <div className="rounded-lg bg-white shadow-custom">
            <div className="rounded-t-lg bg-sky-100 p-6 pb-4">
              <h2 className="text-center text-2xl font-semibold text-sky-700">
                Daftarkan Akun Anda
              </h2>
            </div>
            <div className="p-6 pt-4">
              <Form
                form={form}
                name="register_form"
                onFinish={handleForm}
                onFinishFailed={handleFormFailed}
                autoComplete="off"
                layout="vertical"
                className="custom-form"
                requiredMark={"optional"}
              >
                <Form.Item
                  label="Nama"
                  name="name"
                  rules={[
                    { required: true, message: "Silakan masukkan nama Anda" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Silakan masukkan email Anda" },
                    { type: "email", message: "Alamat email tidak valid!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Silakan masukkan kata sandi Anda",
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                      message:
                        "Kata sandi harus terdiri dari minimal 8 karakter dan mengandung kombinasi huruf dan angka.",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Konfirmasi Password"
                  name="confirm_password"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Silakan masukkan konfirmasi kata sandi Anda",
                    },
                    { validator: compareToFirstPassword },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    className="mt-4 w-full py-2 text-lg md:text-xl"
                    type="primary"
                    htmlType="submit"
                  >
                    Daftar
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-sky-100 p-4 text-center text-sm text-sky-700 shadow-custom md:text-base">
            Sudah memiliki akun?
            <Link href={"/auth/login"}>
              <a className="font-semibold text-sky-700 hover:text-sky-500">
                {" "}
                Masuk
              </a>
            </Link>
          </div>
        </div>
      </>
    </>
  );
};

export default Register;

Register.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
