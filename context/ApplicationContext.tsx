import { createContext, FC, ReactNode, useEffect, useState } from "react";
import debounce from "../utils/Debounce";

export interface ApplicationContextInterface {
  isMobile: boolean;
}

type ApplicationProviderProps = {
  children: ReactNode;
};

export const ApplicationContext =
  createContext<ApplicationContextInterface | null>(null);

export const ApplicationProvider: FC<ApplicationProviderProps> = ({
  children,
}) => {
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
    <ApplicationContext.Provider value={{ isMobile }}>
      {children}
    </ApplicationContext.Provider>
  );
};
