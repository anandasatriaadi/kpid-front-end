import { authService } from "@/common/AuthService";
import httpRequest from "@/common/HttpRequest";
import UserData from "@/types/UserData";
import { message } from "antd";
import { useRouter } from "next/router";
import * as React from "react";
import { UrlObject } from "url";

export interface AuthContextInterface {
  isVerifying: boolean;
  isLoggedIn: boolean;
  userData?: UserData;
  register: (values: UserData) => void;
  login: (values: UserData) => void;
  logout: () => void;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContextInterface | null>(
  null
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [userData, setUserData] = React.useState<UserData>();
  const router = useRouter();

  React.useEffect(() => {
    checkToken();
    authService.sub_logout(logout);
    authService.sub_unauthorized(unauthorized);

    return () => {
      authService.unsub_logout(logout);
      authService.unsub_unauthorized(unauthorized);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const checkToken = async () => {
    const userToken = localStorage.getItem("token");
    const userId = localStorage.getItem("user");

    if (userToken && userId) {
      try {
        const response = await httpRequest
          .get(`/users/${userId}`)
          .catch((error) => {
            if (
              error?.response?.data !== undefined &&
              error.response !== null
            ) {
              return error.response;
            } else {
              throw error;
            }
          });
        const { status, data } = response?.data;

        if (status === 200) {
          setIsLoggedIn(true);
          setUserData(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    setIsVerifying(false);
  };

  const login = async (values: { [key: string]: any }) => {
    const form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    try {
      const response = await httpRequest
        .post("/users/login", form)
        .catch((error) => {
          if (error?.response?.data !== undefined && error.response !== null) {
            return error.response;
          } else {
            throw error;
          }
        });
      const { status, data } = response.data;

      if (status === 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.user_data._id);
        setIsLoggedIn(true);
        setUserData(data.user_data);
        message.success("Login Success");

        const { redirect } = router.query;
        if (redirect) {
          router.push(redirect.toString());
        } else {
          router.push("/");
        }
      } else {
        message.error(data);
      }
    } catch (error) {
      console.error(error);
      message.error("Terjadi kesalahan dalam login");
    }
  };

  const register = async (values: { [key: string]: any }) => {
    const form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    try {
      const response = await httpRequest
        .post("/users/signup", form)
        .catch((error) => {
          if (error?.response?.data !== undefined && error.response !== null) {
            return error.response;
          } else {
            throw error;
          }
        });
      const { status, data } = response.data;

      if (status === 201) {
        message.success(data);
        setTimeout(() => {
          router.push("/login");
        }, 200);
      } else {
        message.error(data);
      }
    } catch (error) {
      console.error(error);
      message.error("Terjadi kesalahan dalam mendaftarkan akun");
    }
  };

  const logout = () => {
    message.loading("Logging Out", 0.5);

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(undefined);

    // Check whether the user is on the login page or not
    console.log(router.asPath);
    if (router.pathname !== "/login") {
      let url: UrlObject = {
        pathname: "/login",
      };

      console.log(router.asPath);
      if (router.asPath !== "/") {
        url.query = { redirect: router.asPath };
      }

      router.push(url);
    }
  };

  const unauthorized = () => {
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ isVerifying, isLoggedIn, userData, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
