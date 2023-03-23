import type { AppProps } from "next/app";
import "../styles/style.scss";

import { AuthProvider } from "../context/AuthContext";
import { MobileProvider } from "../context/MobileContext";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { ConfigProvider } from "antd";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
      <AuthProvider>
        <MobileProvider>
          {getLayout(<Component {...pageProps} />)}
        </MobileProvider>
      </AuthProvider>
  );
}

export default MyApp;
