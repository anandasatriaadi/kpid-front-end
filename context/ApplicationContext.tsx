import debounce from "@/utils/Debounce";
import * as React from "react";

export interface ApplicationContextInterface {
  isMobile: boolean;
}

type ApplicationProviderProps = {
  children: React.ReactNode;
};

export const ApplicationContext =
  React.createContext<ApplicationContextInterface | null>(null);

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  children,
}) => {
  // Initial States
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
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
