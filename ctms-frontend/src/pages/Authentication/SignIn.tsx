import { Link, useNavigate, useParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  AuthenticationRequest,
  AuthenticationResponse,
} from "../../model/auth";
import { httpClient } from "../../libs/httpClient";
import Constant, { ROLE } from "../../libs/constant";
import { useCookies } from "react-cookie";
import { AxiosError, AxiosResponse } from "axios";
import SideAuthen from "../../components/SideAuthen";

const loginFormData = {
  username: "",
  password: "",
};

const SignIn = () => {
  const [formData, setFormData] = useState(loginFormData);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([Constant.ACCESS_TOKEN]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const authenticate = async (request: AuthenticationRequest) => {
    httpClient
      .post<AuthenticationResponse>("/api/auth/login", request)
      .then((res: AxiosResponse<AuthenticationResponse>) => {
        //Check user active
        if (res.data.isActive === true) {
          toast.error("Your account is suspended!");
          return;
        }
        //Save token
        setCookie(Constant.ACCESS_TOKEN, res.data.token, {
          httpOnly: true,
        });
        localStorage.setItem(Constant.REFRESH_TOKEN, res.data.refreshToken);
        //Save ctms user
        localStorage.setItem(
          "ctms_user",
          JSON.stringify({
            avatar: res.data.image,
            role: res.data.role,
            username: res.data.username,
            userId: res.data.userId,
            userNumber: res.data.userNumber,
          })
        );
        toast.success("Đăng nhập thành công!", {
          duration: 1000,
        });
        if (res.data.role === ROLE.CUSTOMER) {
          navigate("/user/order");
        } else if (res.data.role === ROLE.DRIVER) {
          navigate("/myorder");
        } else if (
          res.data.role === ROLE.ADMIN ||
          res.data.role === ROLE.STAFF
        ) {
          navigate("/dashboard");
        } else navigate("/");
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        }
        if (reason.response?.status === 403) {
          // Handle 403
          toast.error("Sai tài khoản hoặc mật khẩu!");
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
      });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Get user information
    const authReq: AuthenticationRequest = {
      email: "formData.email",
      username: formData.username,
      password: formData.password,
    };
    authenticate(authReq);
  };

  return (
    <>
      <div className="flex flex-wrap items-center h-full">
        <SideAuthen />

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Đăng nhập
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Tên tài khoản
                </label>
                <div className="relative">
                  <input
                    type="text'"
                    name="username"
                    placeholder="Tên tài khoản (Username)"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      //stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        //stroke-linecap="round"
                        //stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu (Password)"
                    onChange={handleInputChange}
                    value={formData.password}
                    minLength={6}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-primary text-right mt-2 end-0">
                    <Link to="/forgot">Quên mật khẩu</Link>
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Đăng nhập"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
