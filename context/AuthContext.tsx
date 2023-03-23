import { message } from "antd";
import { useRouter } from "next/router";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { authService } from "../common/AuthService";
import httpRequest from "../common/HttpRequest";
import useSWR from "swr";

export interface AuthContextInterface {
  isLoggedIn: boolean;
  userData: { [key: string]: any };
  register: (values: any) => void;
  login: (values: any) => void;
  logout: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // Initial States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    checkToken();
    authService.subscribe(logout);

    return () => {
      authService.unsubscribe(logout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkToken = async () => {
    let userToken = localStorage.getItem("token");
    if (userToken != null) {
      httpRequest.get("/user").then((response) => {
        const result = response.data;
        if (result.status == 200) {
          setIsLoggedIn(true);
          setUserData(result.data);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserData({});
        }
      });
    }
  };

  // Login method, values are from login form (AntDesign)
  const login = (values: { [key: string]: any }) => {
    let form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    let requestOptions: RequestInit = {
      method: "POST",
      body: form,
      redirect: "follow",
    };

    httpRequest.post("/login", form).then((response) => {
      const result = response.data;
      if (result.status == 200) {
        localStorage.setItem("token", result.data.token);
        setIsLoggedIn(true);
        setUserData(result.data.user_data);
        message.success("Login Success");
        setTimeout(() => {
          router.push("/");
        }, 200);
      } else {
        message.error(result.data.message);
      }
    });
  };

  // Register method, values are from login form (AntDesign)
  const register = (values: { [key: string]: any }) => {
    let form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    let requestOptions: RequestInit = {
      method: "POST",
      body: form,
      redirect: "follow",
    };

    httpRequest.post("/signup", form).then((response) => {
      const result = response.data;
      if (result.status == 201) {
        message.success(result.data);
        setTimeout(() => {
          router.push("/login");
        }, 200);
      } else {
        message.error(result.data);
      }
    });
  };

  // Logout method
  const logout = () => {
    message.loading("Logging Out", 0.5);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData({});
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userData, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
