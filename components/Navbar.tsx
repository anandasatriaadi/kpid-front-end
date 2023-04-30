import { Button, Drawer, Dropdown, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext, AuthContextInterface } from "@/context/AuthContext";
import debounce from "@/utils/Debounce";
import Navlink from "@/components/Navlink";

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
      className="z-50 mb-8 rounded-b-md bg-white p-4 shadow-custom transition-all duration-300"
    >
      <div className="flex justify-between">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-x-4 text-lg">
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
          <div className="hidden items-center gap-x-4 text-lg md:flex">
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
            <div className="flex flex-1 flex-col gap-4">
              <Navlink className="text-lg" route="/" title="Moderasi" />
              <Navlink
                className="text-lg"
                route="/statistic"
                title="Statistik"
              />
              <Navlink className="text-lg" route="/result" title="Hasil" />
            </div>
            {!isLoggedIn ? (
              <div className="mt-4 flex gap-4 bg-white">
                <Navlink
                  className="flex flex-1 items-center justify-center"
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
                className="mt-4 flex h-min items-center justify-center p-2"
                type="primary"
              >
                <span className="mr-2 rounded-full bg-sky-200 p-4"></span>
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
