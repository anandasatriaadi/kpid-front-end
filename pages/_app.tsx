import type { AppProps } from "next/app";
import "../styles/style.scss";

import { AuthProvider } from "../context/AuthContext";
import { ApplicationProvider } from "../context/ApplicationContext";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    // <SessionProvider>
    <AuthProvider>
      <ApplicationProvider>
        {getLayout(<Component {...pageProps} />)}
      </ApplicationProvider>
    </AuthProvider>
    // </SessionProvider>
  );
}

export default MyApp;
