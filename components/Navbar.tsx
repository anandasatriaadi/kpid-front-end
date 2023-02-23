import { Button, Drawer, Dropdown, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextInterface } from "../context/AuthContext";
import debounce from "../utils/Debounce";
import Navlink from "./Navlink";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, userData, logout } = useContext(
    AuthContext
  ) as AuthContextInterface;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const accountMenu = (
    <Menu
      className="account-menu"
      items={[
        {
          key: "1",
          label: (
            <Link className="text-lg" href="/result">
              Hasil
            </Link>
          ),
        },
        {
          key: "2",
          label: (
            <Link className="text-lg" href="/login">
              Pengaturan Akun
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
              <a onClick={logout}>Logout</a>
            </Link>
          ),
        },
      ]}
    />
  );

  // Adding event listener to make navbar hide and show on scroll
  useEffect(() => {
    document.addEventListener(
      "scroll",
      debounce((e: any) => {
        if (document != null) {
          let scrollTop;

          if (
            e.target.firstElementChild == null ||
            e.target.firstElementChild == undefined
          ) {
            return;
          } else {
            scrollTop = e.target.firstElementChild.scrollTop;
          }

          const NavbarElement = document.getElementById("navbar");
          if (scrollTop >= 360) {
            NavbarElement?.classList.add("sticky");
          }
          if (scrollTop < 360) {
            NavbarElement?.classList.remove("sticky");
          }

          if (scrollTop >= 1080) {
            NavbarElement?.classList.remove("-top-16");
            NavbarElement?.classList.add("top-0");
          }
          if (scrollTop < 1080) {
            NavbarElement?.classList.add("-top-16");
            NavbarElement?.classList.remove("top-0");
          }
        }
      }, 200)
    );
  }, []);

  return (
    <div
      id="navbar"
      className="p-4 rounded-b-md shadow-lg z-50 bg-white mb-8 transition-all duration-300"
    >
      <div className="flex justify-between">
        {/* LEFT SECTION */}
        <div className="text-lg flex gap-x-4 items-center">
          {/* <div className="flex flex-col font-bold text-lg leading-4 pr-4 md:backdrop:border-r-2 border-gray-900">
            <div>Moderasi</div>
            <div className="self-end text-sky-500">Video</div>
          </div> */}
          <Link href="/">
            <a>
              <Image
                src={"/logo_kpid.png"}
                width={227}
                height={58}
                alt="Logo KPID Jawa Timur"
              />
            </a>
          </Link>
          <Navlink className="hidden md:inline" route="/" title="Moderasi" />
          <Navlink
            className="hidden md:inline"
            route="/statistic"
            title="Statistik"
          />
          <Navlink className="hidden md:inline" route="/result" title="Hasil" />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center">
          {/* Desktop View */}
          <div className="hidden text-lg md:flex gap-x-4 items-center">
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

          {/* Mobile View */}
          <Button className="md:hidden" type="primary" onClick={showDrawer}>
            -
          </Button>
          <Drawer
            title={<h4 className="text-lg">Navigation Menu</h4>}
            placement="right"
            onClose={onClose}
            open={open}
            size="default"
          >
            <div className="flex flex-col flex-1 gap-4">
              <Navlink className="text-lg" route="/" title="Moderasi" />
              <Navlink
                className="text-lg"
                route="/statistic"
                title="Statistik"
              />
              <Navlink className="text-lg" route="/result" title="Hasil" />
            </div>
            {!isLoggedIn ? (
              <div className="flex gap-4 mt-4 bg-white">
                <Navlink
                  className="flex items-center flex-1 justify-center"
                  bottomBorder={false}
                  route="/login"
                  title="Login"
                />

                <Navlink
                  className="ant-btn ant-btn-primary flex-1"
                  route="/login?tab=register"
                  title="Register"
                  useLinkStyle={false}
                />
              </div>
            ) : (
              <Button
                className="h-min flex mt-4 p-2 items-center justify-center"
                type="primary"
              >
                <span className="p-4 rounded-full bg-sky-200 mr-2"></span>
                Hai! {userData.name}
              </Button>
            )}
          </Drawer>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
