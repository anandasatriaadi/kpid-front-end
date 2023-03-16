import { message } from "antd";
import { useRouter } from "next/router";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { authService } from "../common/AuthService";
import httpRequest from "../common/HttpRequest";
import { BASE_URL } from "../config/Production";
import debounce from "../utils/Debounce";

export interface MobileContextInterface {
  isMobile: boolean;
}

type MobileProviderProps = {
  children: ReactNode;
};

export const MobileContext = createContext<MobileContextInterface | null>(null);

export const MobileProvider: FC<MobileProviderProps> = ({ children }) => {
  // Initial States
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);

    const handleResize = debounce((e: any) => {
      setIsMobile(window.innerWidth <= 768);
    }, 200);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};
