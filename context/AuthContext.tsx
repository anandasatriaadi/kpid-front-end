import { message } from "antd";
import { useRouter } from "next/router";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { authService } from "../common/AuthService";
import httpRequest from "../common/HttpRequest";

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
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [userData, setUserData] = useState<UserData>({});
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
        setTimeout(() => {
          router.push("/");
        }, 200);
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
      const response = await httpRequest.post("/signup", form).catch((err) => {
        throw err;
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
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isVerifying, isLoggedIn, userData, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};