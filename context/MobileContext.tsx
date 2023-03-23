import { createContext, FC, ReactNode, useEffect, useState } from "react";
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
