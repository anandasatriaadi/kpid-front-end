import { authService } from "@/common/AuthService";
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
  faChartSimple,
  faCircleQuestion,
  faCloudArrowUp,
  faFileUpload,
  faHouse,
  faUserShield,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Drawer,
  Dropdown,
  Layout as AntLayout,
  Menu,
  MenuProps,
  Spin,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { UrlObject } from "url";

type LayoutProps = {
  children: React.ReactNode;
};

interface MenuInfo {
  key: string;
  keyPath: string[];
}

type MenuItem = Required<MenuProps>["items"][number];

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

  const sidebarMenus: MenuItem[] = [
    {
      key: "/",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon className="h-[18px]" icon={faHouse} />
        </div>
      ),
      label: "Dasbor",
      className: "flex items-center",
    },
    {
      key: "/result",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon className="h-[18px]" icon={faVideo} />
        </div>
      ),
      label: "Daftar Video",
      className: "flex items-center",
    },
    {
      key: "/statistic",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon className="h-[18px]" icon={faChartSimple} />
        </div>
      ),
      label: "Statistik",
      className: "flex items-center",
    },
    {
      key: "/help",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon className="h-[18px]" icon={faCircleQuestion} />
        </div>
      ),
      label: "Panduan",
      className: "flex items-center",
    },
  ];

  if (isMobile) {
    sidebarMenus.push( 
    {
      key: "upload-modal",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon className="h-[18px]" icon={faCloudArrowUp} />
        </div>
      ),
      label: "Unggah Video",
      className: "flex items-center",
    },
    )
  }

  if (userData !== undefined && userData?.role === "admin") {
    sidebarMenus.push({
      key: "submenu",
      icon: (
        <div className="flex w-[1.5rem] justify-center">
          <FontAwesomeIcon className="h-[18px]" icon={faUserShield} />
        </div>
      ),
      label: "Admin",
      className: collapsed ? "flex items-center" : "",
      children: [
        {
          key: "/admin/user",
          label: "Pengguna",
        },
        {
          key: "/admin/station",
          label: "Stasiun",
        },
      ],
    });
  }
  //#endregion ::: Menu Logic

  //

  //#region ::: Handlers
  //#endregion ::: Handlers

  //

  //#region ::: Other Methods
  const getSelectedMenuKey = (): string => {
    const paths = ["/", "/result", "/help", "/admin/user", "/admin/station"];
    let matched = "";
    paths.forEach((path, i) => {
      if (router.pathname.match(path)) {
        matched = path;
      }
    });

    return matched;
  };

  const handleMenuOnClick = ({ key, keyPath }: MenuInfo) => {
    if (key.startsWith("/")) {
      router.push(key);
      setDrawerMenuOpen(false);
    } else if (key === "upload-modal") {
      setUploadModalOpen(!uploadModalOpen);
      setDrawerMenuOpen(false);
    }
  };
  //#endregion ::: Other Methods

  //

  //#region ::: UseEffect
  React.useEffect(() => {
    const shouldRedirect = !isVerifying && !isLoggedIn;
    // Redirect to login page if not logged in
    if (shouldRedirect && router.pathname !== "/auth/login") {
      let url: UrlObject = {
        pathname: "/auth/login",
      };

      if (router.asPath !== "/") {
        url.query = { redirect: router.asPath };
      }

      router.push(url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, isVerifying, isLoggedIn]);
  //#endregion ::: UseEffect

  if (isVerifying && !isLoggedIn) {
    return (
      <Spin
        size="large"
        className="flex h-screen max-h-screen w-full items-center justify-center"
        spinning={isLoggedIn}
      >
        <UploadModal
          modalOpen={uploadModalOpen}
          setModalOpen={setUploadModalOpen}
        />
      </Spin>
    );
  }
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
          <AntLayout className="custom-layout site-layout relative min-h-screen">
            <AntLayout.Header className="sticky top-0 left-0 right-0 z-50 flex bg-white p-4 shadow-custom">
              <div
                className="trigger flex flex-col justify-center"
                onClick={() => setDrawerMenuOpen(!drawerMenuOpen)}
              >
                <FontAwesomeIcon
                  icon={faBars}
                  className={
                    "h-[18px] transform duration-300" +
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
                        {userData !== undefined && userData.name}
                      </span>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </AntLayout.Header>
            <AntLayout.Content className="flex grow flex-col rounded-tl-lg bg-slate-50">
              <div className="relative flex h-full grow flex-col overflow-x-clip rounded-lg p-4">
                {isVerifying || !isLoggedIn ? (
                  <Spin
                    className="flex h-full w-full flex-col items-center justify-center"
                    size="large"
                  ></Spin>
                ) : (
                  children
                )}
              </div>
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
                selectedKeys={[getSelectedMenuKey()]}
                items={sidebarMenus}
                onClick={handleMenuOnClick}
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
                onClick={handleMenuOnClick}
              />
              <div className="mt-auto px-6 pb-6">
                <div
                  className={
                    "transition-all ease-[cubic-bezier(0.645,0.045,0.355,1)] " +
                    (collapsed ? "max-h-0 opacity-0" : "max-h-screen")
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
                      "flex flex-col gap-4 transition-all ease-[cubic-bezier(0.645,0.045,0.355,1)] " +
                      (!collapsed ? "max-h-0 opacity-0" : "max-h-screen")
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
                  icon={faAngleLeft}
                  className={
                    "h-[18px] transform duration-300" +
                    (collapsed && " -rotate-180")
                  }
                />
              </div>
              <div className="flex flex-1 items-center justify-end gap-x-4 text-lg">
                <div className="flex items-center">
                  <span className="relative mr-2 rounded-full p-4">
                    <Image
                      className="z-10"
                      src={"/user.png"}
                      alt="User Profile Image"
                      layout="fill"
                      objectFit="cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 top-0 z-0 flex flex-col items-center justify-end">
                      <span className="rounded-full bg-slate-200 p-3.5"></span>
                    </span>
                  </span>
                  <Dropdown menu={accountMenu} placement="bottomRight">
                    <a onClick={(e) => e.preventDefault()}>
                      <p className="capitalize">
                        {userData !== undefined && userData.name}
                      </p>
                    </a>
                  </Dropdown>
                </div>
              </div>
            </AntLayout.Header>
            <AntLayout.Content className="flex grow flex-col rounded-tl-lg bg-slate-50">
              <div className="relative flex h-full grow flex-col overflow-x-clip overflow-y-scroll rounded-lg p-4 scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
                {isVerifying || !isLoggedIn ? (
                  <Spin
                    className="flex h-full w-full flex-col items-center justify-center"
                    size="large"
                  ></Spin>
                ) : (
                  children
                )}
              </div>
            </AntLayout.Content>
          </AntLayout>
          <div
            className={
              "absolute bottom-6 flex overflow-hidden transition-all duration-500" +
              (showUpload ? " right-6" : " right-0")
            }
          >
            <Button
              type="primary"
              className={
                "overflow-x-hidden rounded-r-none text-lg transition-all duration-500" +
                (showUpload ? " max-w-min " : " max-w-0 px-0 opacity-0")
              }
              onClick={() => setUploadModalOpen(!uploadModalOpen)}
            >
              <span className="flex items-center justify-center gap-2">
                <FontAwesomeIcon className="h-[18px] " icon={faFileUpload} />
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
                <div className="flex flex-col justify-center px-1">
                  <FontAwesomeIcon
                    className="h-[16px]"
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
