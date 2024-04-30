import Breadcrumb from "../../components/Breadcrumb";
import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { SelectChangeEvent } from "@mui/material";
import toast from "react-hot-toast";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import { ChangePasswordRequest } from "../../model/auth";

const data = {
  oldPassword: "",
  newPassword: "",
  verifyPassword: "",
};

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState(data);
  const [validatePass, setValidatePass] = useState(false);
  const [verifyPass, setVerifyPass] = useState(false);
  const httpClient = useAxiosAuth();

  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.slice(0, 20),
    });
  };

  const changePassword = async (request: ChangePasswordRequest) =>
    await httpClient
      .post("api/auth/pass", request)
      .then((res: AxiosResponse) => {
        toast.success("Đổi mật khẩu thành công!");
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response?.status === 400) {
          toast.error("Mật khẩu cũ không hợp lệ!");
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gửi yêu cầu POST đến API backend để tạo mới người dùng\
    if (!validatePassword()) {
      return;
    }
    const request: ChangePasswordRequest = {
      oldPass: formData.oldPassword,
      newPass: formData.newPassword,
      verifyPass: formData.verifyPassword,
    };
    changePassword(request);
  };

  return (
    <>
      <Breadcrumb pageName="Đổi mật khẩu" />

      <div>
        <div className="flex flex-col gap-9 text-black">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mật khẩu cũ
                    </label>
                    <input
                      required
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Mật khẩu cũ"
                      className="w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mật khẩu mới
                    </label>
                    <input
                      required
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Mật khẩu mới(8-20 ký tự)"
                      className="w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {validatePass && (
                      <p className="text-meta-1 my-2">
                        Mật khẩu phải bao gồm 8-20 ký tự
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nhập lại mật khẩu
                    </label>
                    <input
                      required
                      type="password"
                      id="verifyPassword"
                      name="verifyPassword"
                      value={formData.verifyPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                      className="w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    {verifyPass && (
                      <p className="text-meta-1 my-2">
                        Mật khẩu nhập lại không khớp mật khẩu mới!
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6"
                >
                  Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordForm;
