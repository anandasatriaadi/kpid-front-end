import "@/styles/style.scss";
import type { AppProps } from "next/app";

import { ApplicationProvider } from "@/context/ApplicationContext";
import { AuthProvider } from "@/context/AuthContext";
import { NextPage } from "next";
import * as React from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      <ApplicationProvider>
        {getLayout(<Component {...pageProps} />)}
      </ApplicationProvider>
    </AuthProvider>
  );
}

export default MyApp;
