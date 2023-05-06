import { authService } from "@/common/AuthService";
import httpRequest from "@/common/HttpRequest";
import { message } from "antd";
import { useRouter } from "next/router";
import * as React from "react";
import { UrlObject } from "url";

export interface UserData {
  [key: string]: any;
}

export interface AuthContextInterface {
  isVerifying: boolean;
  isLoggedIn: boolean;
  userData: UserData;
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
  const [userData, setUserData] = React.useState<UserData>({});
  const router = useRouter();

  React.useEffect(() => {
    checkToken();
    authService.subscribe(logout);

    return () => {
      authService.unsubscribe(logout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const checkToken = async () => {
    const userToken = localStorage.getItem("token");

    if (userToken) {
      try {
        const response = await httpRequest.get("/user").catch((err) => {
          throw err;
        });
        const { status, data } = response?.data;

        if (status === 200) {
          setIsLoggedIn(true);
          setUserData(data);
        } else {
          logout();
        }
      } catch (error) {
        console.error(error);
        logout();
      }
    }

    setIsVerifying(false);
  };

  const login = async (values: UserData) => {
    const form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    try {
      const response = await httpRequest.post("/login", form).catch((err) => {
        throw err;
      });
      const { status, data } = response.data;

      if (status === 200) {
        localStorage.setItem("token", data.token);
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
        message.error(data.message);
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong while logging in");
    }
  };

  const register = async (values: UserData) => {
    const form = new FormData();
    for (const key in values) {
      form.append(key, values[key]);
    }

    try {
      const response = await httpRequest
        .post("/signup", form)
        .catch((error) => {
          console.log(error);
          if (error?.response !== undefined || error.response !== null) {
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
      message.error("Something went wrong while registering");
    }
  };

  const logout = () => {
    message.loading("Logging Out", 0.5);
    logoutUser();
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData({});

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

  return (
    <AuthContext.Provider
      value={{ isVerifying, isLoggedIn, userData, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
