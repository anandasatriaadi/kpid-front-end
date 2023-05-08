import { authService } from "@/common/AuthService";
import Navlink from "@/components/Navlink";
import UploadModal from "@/components/UploadModal";
import {
  ApplicationContext,
  ApplicationContextInterface,
} from "@/context/ApplicationContext";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import {
  faAngleLeft,
  faAngleRight,
  faBars,
  faCircleQuestion,
  faCloudArrowUp,
  faFileUpload,
  faUser,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Drawer,
  Dropdown,
  Layout as AntLayout,
  Menu,
  Spin,
} from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import * as React from "react";
import { UrlObject } from "url";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  //#region ::: Variable Initialisations
  const { isVerifying, isLoggedIn, userData } = React.useContext(
    AuthContext
  ) as AuthContextInterface;
  const { isMobile } = React.useContext(
    ApplicationContext
  ) as ApplicationContextInterface;

  const [collapsed, setCollapsed] = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(true);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [drawerMenuOpen, setDrawerMenuOpen] = React.useState(false);
  
  const router = useRouter();
  //#endregion ::: Variable Initialisations

  //

  //#region ::: Menu Logic
  const accountMenu: MenuProps = {
    items: [
      {
        key: "1",
        label: <Link href="/result">Daftar Video</Link>,
      },
      {
        key: "2",
        label: (
          <p
            onClick={() => {
              setUploadModalOpen(!uploadModalOpen);
              setDrawerMenuOpen(false);
            }}
          >
            Unggah Video
          </p>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "3",
        label: (
          <Link href="/">
            <a
              onClick={() => {
                authService.logout();
              }}
            >
              Logout
            </a>
          </Link>
        ),
      },
    ],
  };

  const sidebarMenus: ItemType[] = [
    {
      key: "1",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon height={18} icon={faUser} />
        </div>
      ),
      label: (
        <Link href="/">
          <span>Moderasi</span>
        </Link>
      ),
      className: "flex items-center",
      onClick: () => {
        setDrawerMenuOpen(false);
        router.push("/");
      },
    },
    {
      key: "2",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon height={18} icon={faVideo} />
        </div>
      ),
      label: (
        <Link href="/result">
          <span>Daftar Video</span>
        </Link>
      ),
      className: "flex items-center",
      onClick: () => {
        setDrawerMenuOpen(false);
        router.push("/result");
      },
    },
    {
      key: "3",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon height={18} icon={faCircleQuestion} />
        </div>
      ),
      label: (
        <Link href="/help">
          <span>Panduan</span>
        </Link>
      ),
      className: "flex items-center",
      onClick: () => {
        setDrawerMenuOpen(false);
        router.push("/help");
      },
    },
  ];

  if (isMobile) {
    sidebarMenus.push({
      key: "4",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon height={18} icon={faCloudArrowUp} />
        </div>
      ),
      label: <>Unggah Video</>,
      onClick: () => {
        setUploadModalOpen(!uploadModalOpen);
        setDrawerMenuOpen(false);
      },
    });
  }
  //#endregion ::: Menu Logic

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const getSelectedMenuKey = (): string => {
    const paths = ["/", "/result", "/help"];
    let index = -1;
    paths.forEach((path, i) => {
      if (router.pathname.match(path)) {
        index = i + 1;
      }
    });

    return index.toString();
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    const shouldRedirect = !isVerifying && !isLoggedIn;

    // Redirect to login page if not logged in
    if (shouldRedirect && router.pathname !== "/login") {
      let url: UrlObject = {
        pathname: "/login",
      };

      console.log(router.asPath);
      if (router.asPath !== "/") {
        url.query = { redirect: router.asPath };
      }

      router.push(url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  //#endregion ::: UseEffect

  return (
    <>
      <UploadModal
        modalOpen={uploadModalOpen}
        setModalOpen={setUploadModalOpen}
      />
      {isMobile ? (
        // ========================================================================
        //   MOBILE LAYOUT
        // ========================================================================
        <>
          <AntLayout className="custom-layout site-layout max-h-screen min-h-screen bg-white">
            <AntLayout.Header className="flex bg-white p-4">
              <div
                className="trigger flex flex-col justify-center"
                onClick={() => setDrawerMenuOpen(!drawerMenuOpen)}
              >
                <FontAwesomeIcon
                  height={18}
                  icon={faBars}
                  className={
                    "transform duration-300" +
                    (drawerMenuOpen && " -rotate-180")
                  }
                />
              </div>
              <div className="flex flex-1 items-center justify-end gap-x-4 text-base">
                <div className="flex items-center">
                  <Dropdown menu={accountMenu} placement="bottomRight">
                    <a onClick={(e) => e.preventDefault()}>
                      <span>Hai! </span>
                      <span className="font-bold capitalize">
                        {userData.name}
                      </span>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </AntLayout.Header>
            <AntLayout.Content className="flex grow flex-col rounded-tl-lg bg-slate-100">
              {!isVerifying ? (
                <div className="relative flex h-full grow flex-col overflow-x-clip overflow-y-scroll rounded-lg p-4 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
                  {children}
                </div>
              ) : (
                <div className="flex flex-grow items-center justify-center">
                  <Spin />
                </div>
              )}
            </AntLayout.Content>
            <Drawer
              className="custom-drawer"
              title={
                <div className="flex items-center justify-center">
                  <Link href="/">
                    <a>
                      <Image
                        src={"/logo_kpid.png"}
                        width={117}
                        height={30}
                        alt="Logo KPID Jawa Timur"
                      />
                    </a>
                  </Link>
                </div>
              }
              placement="left"
              onClose={() => setDrawerMenuOpen(false)}
              open={drawerMenuOpen}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={[getSelectedMenuKey()]}
                items={sidebarMenus}
              />
              <div className="mt-auto">
                <h2 className="mb-4 text-center text-sm ">Dikembangkan Oleh</h2>
                <div className="flex justify-center gap-4">
                  <Image
                    src={"/its.png"}
                    height="64"
                    width="64"
                    alt="Logo ITS"
                  />
                  <Image
                    src={"/aihes.png"}
                    height="64"
                    width="96"
                    alt="Logo AIHES"
                  />
                </div>
              </div>
            </Drawer>
          </AntLayout>
        </>
      ) : (
        // ========================================================================
        //   DESKTOP LAYOUT
        // ========================================================================
        <AntLayout className={"custom-layout"}>
          <AntLayout.Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={"light"}
            width={280}
            className="pr-2"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-[72px] flex-col items-center justify-center px-3 pt-4 pb-2">
                <Link href="/">
                  <a>
                    <Image
                      src={"/logo_kpid.png"}
                      width={117}
                      height={30}
                      alt="Logo KPID Jawa Timur"
                    />
                  </a>
                </Link>
              </div>
              <Menu
                mode="inline"
                defaultSelectedKeys={[getSelectedMenuKey()]}
                items={sidebarMenus}
              />
              <div className="mt-auto px-6 pb-6">
                <div
                  className={
                    "max-h-screen transition-all ease-[cubic-bezier(0.645,0.045,0.355,1)] " +
                    (collapsed && "max-h-0 opacity-0")
                  }
                >
                  <h2
                    className={
                      "mb-4 text-center transition-all " +
                      (collapsed && "opacity-0")
                    }
                  >
                    Dikembangkan Oleh
                  </h2>
                  <div className={"flex justify-center gap-4"}>
                    <Image
                      src={"/its.png"}
                      height="64"
                      width="64"
                      alt="Logo ITS"
                    />
                    <Image
                      src={"/aihes.png"}
                      height="64"
                      width="96"
                      alt="Logo AIHES"
                    />
                  </div>
                </div>
                <div>
                  <div
                    className={
                      "flex max-h-screen flex-col gap-4 transition-all ease-[cubic-bezier(0.645,0.045,0.355,1)] " +
                      (!collapsed && "max-h-0 opacity-0")
                    }
                  >
                    <Image
                      src={"/its.png"}
                      height="64"
                      width="64"
                      alt="Logo ITS"
                    />
                    <Image
                      src={"/aihes.png"}
                      height="64"
                      width="96"
                      alt="Logo AIHES"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AntLayout.Sider>
          <AntLayout className="site-layout max-h-screen min-h-screen bg-white">
            <AntLayout.Header className="flex bg-white p-4">
              <div
                className="trigger flex flex-col justify-center"
                onClick={() => setCollapsed(!collapsed)}
              >
                <FontAwesomeIcon
                  height={18}
                  icon={faAngleLeft}
                  className={
                    "transform duration-300" + (collapsed && " -rotate-180")
                  }
                />
              </div>
              <div className="flex flex-1 items-center justify-end gap-x-4 text-lg">
                {!isLoggedIn ? (
                  <>
                    <Navlink route="/login" title="Login" />
                    <Navlink
                      className="ant-btn ant-btn-primary text-lg"
                      route="/login?tab=register"
                      title="Register"
                      useLinkStyle={false}
                      useAnchorTag={false}
                    />
                  </>
                ) : (
                  <div className="flex items-center">
                    <span className="mr-2 rounded-full relative p-4">
                      <Image src={"/user.png"} alt="User Profile Image" layout="fill">

                      </Image>
                    </span>
                    <Dropdown menu={accountMenu} placement="bottomRight">
                      <a onClick={(e) => e.preventDefault()}>
                        <p className="capitalize">{userData.name}</p>
                      </a>
                    </Dropdown>
                  </div>
                )}
              </div>
            </AntLayout.Header>
            <AntLayout.Content className="flex grow flex-col rounded-tl-lg bg-slate-100">
              <div className="relative flex h-full grow flex-col overflow-x-clip overflow-y-scroll rounded-lg p-4 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
                {children}
              </div>
            </AntLayout.Content>
          </AntLayout>
          <div
            className={
              "absolute bottom-6 flex transition-all duration-500" +
              (showUpload ? " right-6" : " right-0")
            }
          >
            <Button
              type="primary"
              className={
                "overflow-x-hidden rounded-r-none text-lg" +
                (showUpload ? "" : " w-0 px-0 opacity-0")
              }
              onClick={() => setUploadModalOpen(!uploadModalOpen)}
            >
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon height={24} icon={faFileUpload} />
                {showUpload ? "Unggah Video" : ""}
              </span>
            </Button>
            <div>
              <Button
                type="primary"
                className={
                  "flex h-full items-center justify-center px-1 text-lg" +
                  (showUpload ? " rounded-l-none" : " rounded-r-none")
                }
                onClick={() => setShowUpload(!showUpload)}
              >
                <div className="px-1">
                  <FontAwesomeIcon
                    height={16}
                    icon={showUpload ? faAngleRight : faAngleLeft}
                  />
                </div>
              </Button>
            </div>
          </div>
        </AntLayout>
      )}
    </>
  );
};

export default Layout;
