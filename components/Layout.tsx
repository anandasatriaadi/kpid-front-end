import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Drawer, Dropdown, Layout as AntLayout, Menu, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { MenuProps } from "rc-menu";
import React, { useContext, useEffect, useState } from "react";
import { authService } from "../common/AuthService";
import { AuthContext, AuthContextInterface } from "../context/AuthContext";
import {
  MobileContext,
  MobileContextInterface,
} from "../context/MobileContext";
import Navlink from "./Navlink";
import UploadModal from "./UploadModal";

const accountMenu: MenuProps = {
  items: [
    {
      key: "1",
      label: (
        <Link className="text-lg" href="/result">
          Daftar Video
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <Link className="text-lg" href="/">
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

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isVerifying, isLoggedIn, userData } = useContext(
    AuthContext
  ) as AuthContextInterface;
  const { isMobile } = useContext(MobileContext) as MobileContextInterface;
  const [collapsed, setCollapsed] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [drawerMenuOpen, setDrawerMenuOpen] = useState(false);
  const router = useRouter();

  const unprotectedRoutes = ["/login", "/register"];
  useEffect(() => {
    if (!isVerifying && !isLoggedIn && !unprotectedRoutes.includes(router.pathname)) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isVerifying]);

  const getSelectedMenuKey = (): string => {
    const paths = ["/", "/result", "/help"];
    let index = 0;
    paths.forEach((path, i) => {
      if (router.pathname.includes(path)) {
        index = i + 1;
      }
    });

    return index.toString();
  };

  const sidebarMenus = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: (
        <Link href="/">
          <span>Moderasi</span>
        </Link>
      ),
      onClick: () => {
        setDrawerMenuOpen(false);
        router.push("/");
      },
    },
    {
      key: "3",
      icon: <QuestionCircleOutlined />,
      label: (
        <Link href="/help">
          <span>Panduan</span>
        </Link>
      ),
      onClick: () => {
        setDrawerMenuOpen(false);
        router.push("/help");
      },
    },
  ];

  if (isLoggedIn) {
    sidebarMenus.splice(1, 0, {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: (
        <Link href="/result">
          <span>Daftar Video</span>
        </Link>
      ),
      onClick: () => {
        setDrawerMenuOpen(false);
        router.push("/result");
      },
    });
  }

  return (
    <>
      <UploadModal
        modalOpen={uploadModalOpen}
        setModalOpen={setUploadModalOpen}
      />
      {isMobile ? (
        <>
          <AntLayout className={"custom-layout"}>
            <AntLayout className="site-layout min-h-screen bg-slate-100">
              <AntLayout.Header className="flex bg-white p-4">
                {collapsed ? (
                  <MenuUnfoldOutlined
                    className="trigger"
                    onClick={() => setDrawerMenuOpen(!drawerMenuOpen)}
                  />
                ) : (
                  <MenuFoldOutlined
                    className="trigger"
                    onClick={() => setDrawerMenuOpen(!drawerMenuOpen)}
                  />
                )}
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
              <AntLayout.Content className="mx-4 my-6 flex grow flex-col">
                {!isVerifying ? children : (
                  <div className="flex-grow flex items-center justify-center">
                    <Spin />
                  </div>
                )}
              </AntLayout.Content>
            </AntLayout>
          </AntLayout>
          <Drawer
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
            <div className="mt-auto px-6 pb-4">
              <Button
                type="primary"
                className="w-full text-lg"
                onClick={() => {
                  setDrawerMenuOpen(false);
                  setUploadModalOpen(!uploadModalOpen);
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon height={24} icon={faFileUpload} />
                  Unggah Video
                </span>
              </Button>
            </div>
          </Drawer>
        </>
      ) : (
        <AntLayout className={"custom-layout"}>
          <AntLayout.Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={"light"}
            width={280}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-center px-3 pt-4 pb-2">
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
              <div className={"mt-auto pb-4 " + (collapsed ? "px-2" : "px-6")}>
                <Button
                  type="primary"
                  className="w-full text-lg"
                  onClick={() => setUploadModalOpen(!uploadModalOpen)}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon height={24} icon={faFileUpload} />
                    {!collapsed ? "Unggah Video" : ""}
                  </span>
                </Button>
              </div>
            </div>
          </AntLayout.Sider>
          <AntLayout className="site-layout max-h-screen min-h-screen bg-slate-100">
            <AntLayout.Header className="flex bg-white p-4">
              {collapsed ? (
                <MenuUnfoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(!collapsed)}
                />
              ) : (
                <MenuFoldOutlined
                  className="trigger"
                  onClick={() => setCollapsed(!collapsed)}
                />
              )}
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
                    <span className="mr-2 rounded-full bg-gray-400 p-4"></span>
                    <Dropdown menu={accountMenu} placement="bottomRight">
                      <a onClick={(e) => e.preventDefault()}>
                        <p className="capitalize">{userData.name}</p>
                      </a>
                    </Dropdown>
                  </div>
                )}
              </div>
            </AntLayout.Header>
            <AntLayout.Content className="mx-4 my-6 flex grow flex-col overflow-y-scroll overflow-x-clip">
              {children}
            </AntLayout.Content>
          </AntLayout>
        </AntLayout>
      )}
    </>
  );
}
