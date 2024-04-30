import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
import { axiosAuth } from "../httpClient";
import Constant from "../constant";
import { useCookies } from "react-cookie";
import { AxiosInstance } from "axios";

function useAxiosAuth(): AxiosInstance {
  const [cookies, setCookie] = useCookies([Constant.ACCESS_TOKEN]);
  const [token, setToken] = useState(cookies.access_token);
  const refreshToken = useRefreshToken();
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = "Bearer " + cookies.access_token;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => {
        if (response.status === 200) {
          // console.clear();
        }
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 401 ||
            error?.response?.status === 403) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          await refreshToken().then((res) => {
            if (res) {
              if (res.refreshToken) {
                localStorage.setItem(Constant.REFRESH_TOKEN, res.refreshToken);
              }
              if (res.token) {
                setCookie(Constant.ACCESS_TOKEN, res.token);
                prevRequest.headers["Authorization"] = "Bearer " + res.token;
              }
              console.log("Result: " + JSON.stringify(res));
              setToken(res.token);
            }
          });
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, []);
  return axiosAuth;
}

export default useAxiosAuth;
