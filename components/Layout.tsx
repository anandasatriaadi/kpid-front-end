import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout as AntLayout, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { authService } from "../common/AuthService";
import { AuthContext, AuthContextInterface } from "../context/AuthContext";
import { isEmpty, isNilOrEmpty } from "../utils/CommonUtil";
import Navlink from "./Navlink";

const accountMenu = (
  <Menu
    className="account-menu"
    items={[
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
        key: "2",
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
    ]}
  />
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, userData } = useContext(
    AuthContext
  ) as AuthContextInterface;
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const unprotectedRoutes = ["/login", "/register"];
  useEffect(() => {
    if (!isLoggedIn && !unprotectedRoutes.includes(router.pathname)) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

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
      label: <Link href="/">Moderasi</Link>,
    },
    {
      key: "3",
      icon: <QuestionCircleOutlined />,
      label: <Link href="/help">Panduan</Link>,
    },
  ];

  if (isLoggedIn) {
    sidebarMenus.splice(1, 0, {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link href="/result">Daftar Video</Link>,
    });
  }

  return (
    <AntLayout className={"custom-layout"}>
      <AntLayout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={"light"}
        width={280}
      >
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
      </AntLayout.Sider>
      <AntLayout className="site-layout max-h-screen min-h-screen">
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
                <Dropdown overlay={accountMenu} placement="bottomRight">
                  <a onClick={(e) => e.preventDefault()}>
                    <p className="capitalize">{userData.name}</p>
                  </a>
                </Dropdown>
              </div>
            )}
          </div>
        </AntLayout.Header>
        <AntLayout.Content className="mx-4 my-6 flex grow flex-col overflow-y-scroll">
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  );
}
