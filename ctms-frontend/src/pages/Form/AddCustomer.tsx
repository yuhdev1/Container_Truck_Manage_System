import Breadcrumb from "../../components/Breadcrumb";
import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import toast from "react-hot-toast";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const AddCustomer = () => {
  const axios = useAxiosAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    role: "CUSTOMER",
    birthDate: "",
    personalId: "",
    isActive: true,
  });
  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedFormData = { ...formData };
    if (updatedFormData.birthDate) {
      updatedFormData.birthDate = dayjs(
        formData.birthDate,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY");
    }

    if (formData.birthDate > new Date().toISOString().slice(0, 10)) {
      toast.error("Ngày sinh không thể là ngày trong tương lai!");
    } else {
      axios
        .post("http://localhost:8099/api/user", updatedFormData)
        .then((response) => {
          navigate("/user");
          toast.success("Tạo mới người dùng thành công");
        })
        .catch((error) => {
          // Xử lý sau khi gặp lỗi, ví dụ: hiển thị thông báo lỗi
          toast.error("Email này đã tồn tại!");
        });
    }
  };
  return (
    <>
      <Breadcrumb pageName="Thêm mới người dùng" />
      <div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Tạo mới khách hàng
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Họ
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      pattern="[a-zA-Z\s_àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]+"
                      title="Vui lòng chỉ nhập chữ cái"
                      maxLength={30}
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Nhập họ của người dùng"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tên
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      pattern="[a-zA-Z\s_àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]+"
                      title="Vui lòng chỉ nhập chữ cái"
                      maxLength={30}
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nhập tên người dùng"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      CMND
                    </label>
                    <input
                      type="text"
                      name="personalId"
                      required
                      pattern="[0-9]{12}"
                      title="Vui lòng nhập 12 chữ số "
                      value={formData.personalId}
                      onChange={handleChange}
                      placeholder="Nhập chứng minh nhân dân"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Địa Chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      maxLength={100}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      maxLength={30}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      pattern="[0-9]{10}"
                      title="Vui lòng nhập số điện thoại có 10 số "
                      value={formData.phone}
                      required
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      required
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2"></div>
                </div>

                <button
                  type="submit"
                  className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCustomer;
