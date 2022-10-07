import { Button, Dropdown, Menu, Space } from "antd";
import Link from "next/link";
import React from "react";
import Navlink from "./Navlink";

function Navbar() {
  const accountMenu = (
    <Menu
      className="account-menu"
      items={[
        {
          key: "1",
          label: (
            <Link href="/result">
              Hasil
            </Link>
          )
        },
        {
          key: "2",
          label: (
            <Link href="/login">
              Pengaturan Akun
            </Link>
          )
        },
        {
          type: "divider"
        },
        {
          key: "3",
          label: (
            <Link href="/logout">
              Logout
            </Link>
          )
        }
      ]}
    />
    )

  return (
    <div className="p-4 rounded-b-md shadow-lg">
      <div className="flex justify-between font-semibold">
        <div className="flex gap-x-4 items-center">
          <div className="flex flex-col font-bold text-lg leading-4 pr-4 border-r-2 border-gray-900">
            <div>Moderasi</div>
            <div className="self-end text-sky-500">Video</div>
          </div>
          <Navlink route="/" title="Moderasi" />
          <Navlink route="/statistic" title="Statistik" />
          <Navlink route="/result" title="Hasil" />
        </div>
        <div className="flex gap-x-4 items-center">
          <Navlink route="/login" title="Login" />
          <Link href="/register">
            <a className="ant-btn ant-btn-primary">
              Daftar
            </a>
          </Link>
          <div className="flex items-center">
            <span className="p-4 rounded-full bg-gray-400 mr-2">
            </span>
            <Dropdown overlay={accountMenu}>
              <a onClick={e => e.preventDefault()} className="">
                  <p>Akun</p>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
