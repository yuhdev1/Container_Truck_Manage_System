import { Link, useNavigate, useParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  AuthenticationRequest,
  ChangePasswordRequest,
  VerifyOtpRequest,
} from "../../model/auth";
import SideAuthen from "../../components/SideAuthen";
import { AxiosError, AxiosResponse } from "axios";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import useCountDown from "../../libs/hook/useCountDown";

const data = {
  oldPassword: "",
  newPassword: "",
  verifyPassword: "",
  email: "",
};

const ForgotPassword = () => {
  const [formData, setFormData] = useState(data);
  const [sentOtp, setSentOtp] = useState(true);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [validatePass, setValidatePass] = useState(false);
  const [verifyPass, setVerifyPass] = useState(false);
  const { secondLeft, start } = useCountDown();
  const httpClient = useAxiosAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendOtpApi = async (isResent: boolean) =>
    await httpClient
      .get("api/auth/pass/otp?email=" + email)
      .then((res: AxiosResponse) => {
        if (!isResent) {
          setSentOtp(false);
          setVerifyOtp(true);
          start(60);
        }
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response?.status === 404) {
          toast.error("Email không hợp lệ!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        console.log(reason.message);
      });

  const verifyOtpApi = async (request: VerifyOtpRequest) =>
    await httpClient
      .post("api/auth/pass/otp", request)
      .then((res: AxiosResponse) => {
        setVerifyOtp(false);
        setChangePassword(true);
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response?.status === 400) {
          toast.error("Xác thực thất bại!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        console.log(reason.message);
      });

  const changePasswordApi = async (request: ChangePasswordRequest) =>
    await httpClient
      .post("api/auth/pass", request)
      .then((res: AxiosResponse) => {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/signin");
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response?.status === 400) {
          toast.error("Chưa xác thực otp!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        console.log(reason.message);
      });

  const handleResend = () => {
    sendOtpApi(true);
    toast.success("Gửi lại mã thành công!");
    start(60);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //send otp
    if (sentOtp) {
      sendOtpApi(false);
      return;
    }
    //verify otp
    if (verifyOtp) {
      const request: VerifyOtpRequest = {
        email: email,
        otp: otp,
      };
      verifyOtpApi(request);

      return;
    }

    //change password
    if (changePassword) {
      if (!validatePassword()) {
        return;
      }
      const request: ChangePasswordRequest = {
        newPass: formData.newPassword,
        verifyPass: formData.verifyPassword,
        email: email,
      };
      changePasswordApi(request);
      return;
    }
  };

  function validatePassword() {
    const passwordRegex = /^.{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      setValidatePass(true);
      return false;
    }
    setValidatePass(false);
    if (formData.newPassword !== formData.verifyPassword) {
      setVerifyPass(true);
      return false;
    }
    setVerifyPass(false);
    return true;
  }
  return (
    <>
      <div className="flex flex-wrap items-center">
        <SideAuthen />

        <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              {changePassword ? "Đặt lại mật khẩu" : "Quên mật khẩu"}
            </h2>
            {sentOtp && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Nhập email của bạn để lấy mã xác nhận
                  </label>
                  <div className="relative">
                    <input
                      type="email'"
                      name="username"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Lấy lại mật khẩu"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                  <p className="text-primary mt-3">
                    <Link to="/">Quay lại đăng nhập</Link>
                  </p>
                </div>
              </form>
            )}

            {verifyOtp && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Mã xác nhận đã được gửi tới email{" "}
                    <span className="font-bold">{" " + email}</span>. Vui lòng
                    kiểm tra và nhập mã xác nhận.
                  </label>
                  <div className="relative">
                    <input
                      type="email'"
                      name="username"
                      placeholder="Mã xác thực"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
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
                  <div>
                    <button
                      type="button"
                      disabled={secondLeft > 0}
                      onClick={handleResend}
                      className={`mt-2 inline-flex items-center justify-center rounded-md  py-2 px-7 text-center ${
                        secondLeft === 0 ? "bg-primary" : "bg-bodydark"
                      } font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6`}
                    >
                      Gửi lại mã {secondLeft > 0 && ` (${secondLeft})`}
                    </button>
                  </div>
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Lấy lại mật khẩu"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                  <p className="text-primary mt-3">
                    <Link to="/">Quay lại đăng nhập</Link>
                  </p>
                </div>
              </form>
            )}

            {changePassword && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Nhập mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Mật khẩu"
                      onChange={handleInputChange}
                      value={formData.newPassword}
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
                  {validatePass && (
                    <p className="text-meta-1 my-2">
                      Mật khẩu phải bao gồm 8-20 ký tự
                    </p>
                  )}
                  <label className="mb-2.5 mt-1.5 block font-medium text-black dark:text-white">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="verifyPassword"
                      placeholder="Xác nhận mật khẩu"
                      onChange={handleInputChange}
                      value={formData.verifyPassword}
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
                  {verifyPass && (
                    <p className="text-meta-1 my-2">
                      Mật khẩu nhập lại không khớp mật khẩu mới!
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value={
                      sentOtp
                        ? "Lấy lại mật khẩu"
                        : verifyOtp
                        ? "Tiếp tục"
                        : "Đặt lại"
                    }
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                  <p className="text-primary mt-3">
                    <Link to="/">Quay lại đăng nhập</Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
