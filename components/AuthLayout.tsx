import Sadis from "@/components/icons/Sadis";
import Sara from "@/components/icons/Sara";
import Saru from "@/components/icons/Saru";
import SiaranPartisan from "@/components/icons/SiaranPartisan";
import Sihir from "@/components/icons/Sihir";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const IconWrapperClass = "h-full flex flex-col items-center my-2";
const IconCardClass = "rounded-lg p-2 bg-slate-900 bg-opacity-30 shadow-custom";
const IconSubtitleClass = "mt-2 text-lg text-center";

const AuthLayout = ({ children }: LayoutProps) => {
  //#region ::: Variable Initialisations
  const router = useRouter();
  const { isLoggedIn, isVerifying } = React.useContext(
    AuthContext
  ) as AuthContextInterface;
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    if (isLoggedIn) {
      const { redirect } = router.query;
      if (redirect) {
        router.push(redirect.toString());
      } else {
        router.push("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
  //#endregion ::: UseEffect

  if (isVerifying && !isLoggedIn) {
    return <></>;
  }
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <section className="relative z-[-2] hidden min-h-screen flex-col bg-gradient-to-t from-sky-700 to-sky-500 lg:flex">
          <div className="mt-16 px-8 2xl:mt-24">
            <h2 className="mb-16 text-center font-bold text-white lg:text-4xl 2xl:mb-24">
              5S Racun Siaran
            </h2>
            <div className="grid grid-cols-5 items-center gap-2 text-white">
              <div className={IconWrapperClass}>
                <span className={IconCardClass}>
                  <Sara height="48" width="48"></Sara>
                </span>
                <p className={IconSubtitleClass}>SARA</p>
              </div>
              <div className={IconWrapperClass}>
                <span className={IconCardClass}>
                  <Saru height="48" width="48"></Saru>
                </span>
                <p className={IconSubtitleClass}>SARU</p>
              </div>
              <div className={IconWrapperClass}>
                <span className={IconCardClass}>
                  <Sadis height="48" width="48"></Sadis>
                </span>
                <p className={IconSubtitleClass}>SADIS</p>
              </div>
              <div className={IconWrapperClass}>
                <span className={IconCardClass}>
                  <Sihir height="48" width="48"></Sihir>
                </span>
                <p className={IconSubtitleClass}>SIHIR</p>
              </div>
              <div className={IconWrapperClass}>
                <span className={IconCardClass}>
                  <SiaranPartisan height="48" width="48"></SiaranPartisan>
                </span>
                <p className={IconSubtitleClass}>Siaran Partisan</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="mt-16 text-justify text-lg tracking-tight text-white md:w-3/4 md:text-2xl 2xl:mt-24">
              Website Moderasi Video KPID Jawa Timur 2023
            </p>
            <p className="mt-4 text-justify text-base tracking-tight text-white md:w-3/4 md:text-lg">
              Melindungi masyarakat Indonesia dari siaran mengandung 5S: SARU,
              SARA, SADIS, SIHIR, dan Siaran Partisan melalui pengawasan siaran
              televisi
            </p>
          </div>
          <div className="absolute left-0 right-0 bottom-0 z-[-1] h-1/2 opacity-50 mix-blend-multiply grayscale">
            <div className="relative h-full w-full">
              <Image
                src={"/login_image.png"}
                layout="fill"
                objectFit="cover"
                alt="Logo KPID Jawa Timur"
              />
            </div>
          </div>
        </section>
        <section className="flex max-h-screen min-h-screen flex-col overflow-y-scroll bg-slate-50 py-8 px-8 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full md:py-16 md:px-16">
          {children}
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
