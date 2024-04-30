import { Select } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { FormEvent, useState, useEffect } from "react";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { user } from "../../model/user";

const AddOrder = () => {
  const [customers, setCustomers] = useState<user[]>([]);
  const [drivers, setDrivers] = useState<user[]>([]);
  useEffect(() => {
    // Gọi API để lấy danh sách khách hàng và tài xế
    const fetchCustomersAndDrivers = async () => {
      try {
        const customersResponse = await axios.get(
          "http://localhost:8099/api/user?role=CUSTOMER"
        );
        setCustomers(customersResponse.data.content);

        const driversResponse = await axios.get(
          "http://localhost:8099/api/user?role=DRIVER"
        );
        setDrivers(driversResponse.data.content);
      } catch (error) {
        console.error("Error fetching customers and drivers:", error);
      }
    };

    fetchCustomersAndDrivers();
  }, []);
  const [formData, setFormData] = useState({
    orderNumber: "",
    customerId: "",

    status: "",
    orderDate: "",
    expectedDeliveryDate: "",
    deliveryStartDate: "",
  });
  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleDriverChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gửi yêu cầu POST đến API backend để tạo mới người dùng
    axios
      .post("http://localhost:8099/api/order", formData)
      .then((response) => {
        console.log("User created successfully:", response.data);
        // Xử lý sau khi tạo thành công, ví dụ: hiển thị thông báo
        alert("User created successfully!");
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        console.log("form data", formData);
        // Xử lý sau khi gặp lỗi, ví dụ: hiển thị thông báo lỗi
        alert("Error creating user. Please try again.");
      });
  };
  return (
    <>
      <Breadcrumb pageName="Tạo mới đơn hàng" />

      <div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Tạo mới đơn hàng
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mã đơn hàng
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Trạng thái đơn hàng
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                      <InputLabel id="label_delect_driver">status</InputLabel>
                      <Select
                        name="status"
                        labelId="label_delect_driver"
                        id="select_driver"
                        value={formData.status}
                        label="Tài xế"
                        onChange={handleDriverChange}
                      >
                        <MenuItem value="PENDING">Đang vận chuyển</MenuItem>
                        <MenuItem value="TOPAY">Chưa thanh toán</MenuItem>
                        <MenuItem value="TOSHIP">Đang giao hàng</MenuItem>
                        <MenuItem value="TORECIEVE">Đã nhận hàng</MenuItem>
                        <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                        <MenuItem value="CANCELLED">Huỷ đơn hàng</MenuItem>
                        <MenuItem value="REFUND">Hoàn tiền</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Khánh hàng
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                      <InputLabel id="label_delect_customer">
                        customer
                      </InputLabel>
                      <Select
                        name="customerId"
                        labelId="label_delect_customer"
                        id="select_customer"
                        label="customerId"
                        onChange={handleDriverChange}
                      >
                        {customers &&
                          customers.map((customer) => (
                            <MenuItem value={customer.userId}>
                              {customer.firstName} {customer.lastName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày nhận hàng dự kiến
                    </label>
                    <input
                      type="date"
                      name="expectedDeliveryDate"
                      value={formData.expectedDeliveryDate}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày đặt hàng
                    </label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày giao hàng
                    </label>
                    <input
                      type="date"
                      name="deliveryStartDate"
                      value={formData.deliveryStartDate}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row"></div>

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

export default AddOrder;
