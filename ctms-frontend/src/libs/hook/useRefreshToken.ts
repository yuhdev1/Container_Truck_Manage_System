import Constant from "../constant";
import { httpClient } from "../httpClient";
import { RefreshTokenResponse } from "../../model/auth";
import { AxiosError, AxiosResponse } from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function useRefreshToken() {
  const [cookies, setCookie] = useCookies([Constant.ACCESS_TOKEN]);
  const navigate = useNavigate();

  const refreshToken = async () => {
    return await httpClient
      .post<RefreshTokenResponse>(
        "/api/auth/refresh",
        {
          refresh_token: localStorage.getItem(Constant.REFRESH_TOKEN),
        },
        {
          withCredentials: true,
        }
      )
      .then((res: AxiosResponse<RefreshTokenResponse>) => {
        return res.data;
      })
      .catch((reason: AxiosError) => {
        // toast.success("Phiên đăng nhập hết hạn!");
        localStorage.removeItem(Constant.REFRESH_TOKEN);
        localStorage.removeItem("ctms_user");
        setCookie(Constant.ACCESS_TOKEN, "");
        navigate("/signin");
      });
  };
  return refreshToken;
}

export default useRefreshToken;
