import { Select } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { FormEvent, useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import toast from "react-hot-toast";
import { ContainerTruck } from "../../model/truck";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const AddEmployee = () => {
  const axios = useAxiosAuth();
  const navigate = useNavigate();
  const [container, setContainer] = useState<ContainerTruck[]>([]);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    role: "",
    birthDate: "",
    personalId: "",
    fixedSalary: "",
    truckId: "",
    isActive: true,
  });
  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8099/api/containertruck/notInUse")
      .then((response) => {
        setContainer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gửi yêu cầu POST đến API backend để tạo mới nhân viên
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
          console.log("User created successfully:", response.data);
          // Xử lý sau khi tạo thành công, ví dụ: hiển thị thông báo
          navigate("/employee");
          toast.success("Tạo mới nhân viên thành công");
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          console.log("form data", formData);
          // Xử lý sau khi gặp lỗi, ví dụ: hiển thị thông báo lỗi
          toast.error("Email đã tồn tại!");
        });
    }
  };
  return (
    <>
      <Breadcrumb pageName="Thêm mới nhân viên" />

      <div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Tạo mới nhân viên
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
                      title="Vui lòng chỉ nhập chữ cái tiếng Việt "
                      value={formData.firstName}
                      onChange={handleChange}
                      maxLength={30}
                      placeholder="Nhập họ của nhân viên"
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
                      maxLength={30}
                      pattern="[a-zA-Z\s_àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]+"
                      title="Vui lòng chỉ nhập chữ cái tiếng Việt "
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nhập tên nhân viên"
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
                      title="Vui lòng chỉ nhập chữ cái "
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
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Lương (VND) / 1 tháng
                    </label>
                    <input
                      type="number"
                      name="fixedSalary"
                      title="Vui lòng nhập số "
                      value={formData.fixedSalary}
                      required
                      maxLength={30}
                      onChange={handleChange}
                      placeholder="Nhập lương"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Vai trò
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                      <InputLabel id="label_delect_driver">Vai trò</InputLabel>
                      <Select
                        name="role"
                        labelId="label_delect_driver"
                        id="select_driver"
                        value={formData.role}
                        label="Tài xế"
                        required
                        onChange={handleChange}
                      >
                        <MenuItem value="DRIVER">Tài xế</MenuItem>
                        <MenuItem value="STAFF">Quản Lí</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {formData.role === "DRIVER" && (
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-black dark:text-white">
                        Xe
                      </label>
                      <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                        <InputLabel id="label_delect_driver">Xe</InputLabel>
                        <Select
                          name="truckId"
                          labelId="label_delect_truck"
                          id="select_truck"
                          required
                          value={formData.truckId}
                          label="Truck"
                          onChange={handleChange}
                        >
                          {container && container.length > 0 ? (
                            container.map((con, index) => (
                              <MenuItem key={index} value={con.truckId}>
                                {con.licensePlate}
                              </MenuItem>
                            ))
                          ) : (
                            <>
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                            </>
                          )}
                        </Select>
                      </FormControl>
                    </div>
                  )}
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

export default AddEmployee;
