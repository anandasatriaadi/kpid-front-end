import { authService } from "@/common/AuthService";
import httpRequest from "@/common/HttpRequest";
import UserData from "@/types/UserData";
import {
  debounceErrorMessage,
  debounceLoadingMessage,
  debounceSuccessMessage,
} from "@/utils/Debounce";
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

    if (!!userToken && !!userId) {
      try {
        const response = await httpRequest
          .get(`/users/${userId}`)
          .catch((error) => {
            if (error?.response?.data?.data !== undefined) {
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
    debounceLoadingMessage("Logging In");
    const form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    try {
      const response = await httpRequest
        .post("/users/login", form)
        .catch((error) => {
          if (error?.response?.data?.data !== undefined) {
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
        debounceSuccessMessage("Login Berhasil");

        const { redirect } = router.query;
        if (redirect) {
          router.push(redirect.toString());
        } else {
          router.push("/");
        }
      } else {
        debounceErrorMessage(data);
      }
    } catch (error) {
      console.error(error);
      debounceErrorMessage("Terjadi Kesalahan dalam Login");
    }
  };

  const register = async (values: { [key: string]: any }) => {
    debounceLoadingMessage("Registrasi Pengguna");
    const form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    try {
      const response = await httpRequest
        .post("/users/signup", form)
        .catch((error) => {
          if (error?.response?.data?.data) {
            return error.response;
          } else {
            throw error;
          }
        });
      const { status, data } = response.data;

      if (status === 201) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", data.user_data._id);
        setIsLoggedIn(true);
        setUserData(data.user_data);
        debounceSuccessMessage("Berhasil Mendaftarkan Akun");
        router.push("/");
      } else {
        debounceErrorMessage(data);
      }
    } catch (error) {
      console.error(error);
      debounceErrorMessage("Terjadi Kesalahan dalam Mendaftarkan Akun");
    }
  };

  const logout = () => {
    debounceLoadingMessage("Logging Out");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(undefined);

    // Check whether the user is on the login page or not
    if (router.pathname !== "/auth/login") {
      let url: UrlObject = {
        pathname: "/auth/login",
      };

      if (router.asPath !== "/") {
        url.query = { redirect: router.asPath };
      }

      router.push(url);
    }
  };

  const unauthorized = () => {
    debounceErrorMessage("Anda Tidak Memiliki Hak Akses");
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
