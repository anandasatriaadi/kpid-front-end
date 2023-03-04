import { message } from "antd";
import { useRouter } from "next/router";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { authService } from "../common/AuthService";
import httpRequest from "../common/HttpRequest";
import { BASE_URL } from "../config/Production";

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
      const response = await fetch(BASE_URL + "/api/user", {
        method: "GET",
        headers: { Authorization: "Bearer " + userToken },
      }).catch((err) => console.log(err));

      if (response != null) {
        try {
          let res = JSON.parse(await response.text());
          if (response.status == 200) {
            setIsLoggedIn(true);
            setUserData(res.data);
          } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setUserData({});
          }
        } catch (error) {
          message.error("Something went wrong");
        }
      }
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

    fetch(BASE_URL + "/api/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
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
      })
      .catch((error) => console.log("error", error));
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

    fetch(BASE_URL + "/api/signup", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status == 201) {
          message.success(result.data);
          setTimeout(() => {
            router.push("/login");
          }, 200);
        } else {
          message.error(result.data);
        }
      })
      .catch((error) => console.log("error", error));
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
