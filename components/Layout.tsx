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

  if (!isLoggedIn) {
    sidebarMenus.splice(1, 0, {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: <Link href="/result">Daftar Video</Link>,
    });
  }

  return (
    <AntLayout>
      <AntLayout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={"light"}
        className={"custom-layout-sider"}
      >
        <div className="flex justify-center items-center pt-4 pb-2 px-3">
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
      <AntLayout className="site-layout min-h-screen max-h-screen">
        <AntLayout.Header className="flex p-4 bg-white">
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
          <div className="flex-1 text-lg flex gap-x-4 items-center justify-end">
            {!isLoggedIn ? (
              <>
                <Navlink route="/login" title="Login" />
                <Navlink
                  className="text-lg ant-btn ant-btn-primary"
                  route="/login?tab=register"
                  title="Register"
                  useLinkStyle={false}
                  useAnchorTag={false}
                />
              </>
            ) : (
              <div className="flex items-center">
                <span className="p-4 rounded-full bg-gray-400 mr-2"></span>
                <Dropdown overlay={accountMenu} placement="bottomRight">
                  <a onClick={(e) => e.preventDefault()}>
                    <p>Hai! {userData.name}</p>
                  </a>
                </Dropdown>
              </div>
            )}
          </div>
        </AntLayout.Header>
        <AntLayout.Content
          className="grow overflow-y-scroll"
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "white",
          }}
        >
          {children}
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  );
}
