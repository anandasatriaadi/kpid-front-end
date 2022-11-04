import { message } from "antd";
import { useRouter } from "next/router";
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthContextInterface {
  isLoggedIn: boolean;
  userData: { [key: string]: any };
  login: (values: any) => void;
  logout: () => void;
}

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();

  // Initial States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const checkToken = async () => {
    let userToken = localStorage.getItem("token");
    if (userToken != null) {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "GET",
        headers: { Authorization: userToken },
      }).catch((err) => console.log(err));

      if (response != null) {
        let res = JSON.parse(await response.text());
        if (response.status == 200) {
          setIsLoggedIn(true);
          setUserData(res.data);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserData({});
          message.warning("Logging Out");
        }
      }
    }
  };

  // Login if token is valid
  useEffect(() => {
    checkToken();
  }, []);

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

    fetch("http://localhost:5000/api/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        let res = JSON.parse(result);
        if (res.status == 200) {
          localStorage.setItem("token", res.data.token);
          setIsLoggedIn(true);
          setUserData(res.data.user_data);
          message.success("Login Success");
          setTimeout(() => {
            router.push("/");
          }, 200);
        } else {
          message.error(res.data.message);
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
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
