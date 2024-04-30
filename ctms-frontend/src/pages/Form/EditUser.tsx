
import Breadcrumb from "../../components/Breadcrumb";
import { FormEvent, useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material";
import { user } from "../../model/user";
import { useParams } from "react-router-dom";
import { ContainerTruck } from "../../model/container_truck";
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import dayjs from 'dayjs';
import { order } from "../../model/order";
import { debounce } from 'lodash';
import moment from 'moment';
import { FormControl, InputLabel, MenuItem, Pagination, Select, Stack, } from "@mui/material";
import toast from "react-hot-toast";

//tab
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const EditUser = () => {

  //hook
  const axios = useAxiosAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  //react tab
  const [value, setValue] = React.useState(0);
  const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //order state
  const [orderNumber, setOrderNumber] = useState('');
  const [paid, setPaid] = useState('');
  const [price, setPrice] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fullName, setFullName] = useState('');
  const [eta, setEta] = useState('');
  const [etd, setEtd] = useState('');
  const [status, setStatus] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [orders, setOrders] = useState<order[]>([]);
  const [userNumber, setUserNumber] = useState('');

  //formData
  const [containers, setContainers] = useState<ContainerTruck[]>([]);
  const [currentContainer, setCurrentContainer] = useState<ContainerTruck>();
  const [dataReady, setDataReady] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    role: "",
    birthDate: "",
    personalId: "",
    isActive: true,
    truckId: "",
    fixedSalary: ""
  });

  //Pagination
  const handlePageClick = (event: any, page: number) => {
    setCurrentPage(page);
    try {
      let apiUrl = `http://localhost:8099/api/order?customerId=${userId}&page=${page - 1}&size=4`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (paid) {
        apiUrl += `&paid=${paid}`;
      }
      if (price) {
        apiUrl += `&price=${price}`;
      }
      if (eta) {
        apiUrl += `&eta=${eta}`;
      }
      if (etd) {
        apiUrl += `&etd=${etd}`;
      }
      if (status) {
        apiUrl += `&status=${status}`;
      }
      axios.get(apiUrl)
        .then(response => {
          setOrders(response.data.content);
          setTotalPages(response.data.totalPages);

        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  //Searching
  const handleSearchOrderNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setOrderNumber(inputValue);
    debouncedSearch(inputValue, paid, price, eta, etd, status);
  };
  const handleSearchPaid = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setPaid(inputValue)
    debouncedSearch(orderNumber, inputValue, price, eta, etd, status);
  };
  const handleSearchPrice = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setPrice(inputValue)
    debouncedSearch(orderNumber, paid, inputValue, eta, etd, status);
  };
  const handleSearchEta = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEta(inputValue)
    debouncedSearch(orderNumber, paid, price, inputValue, etd, status);
  };
  const handleSearchEtd = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEtd(inputValue)
    debouncedSearch(orderNumber, paid, price, eta, inputValue, status);
  };
  const handleSearchStatus = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setStatus(inputValue)
    debouncedSearch(orderNumber, paid, price, eta, etd, inputValue);
  };

  const debouncedSearch = debounce(async (orderNumber: string, paid: string, price: string, eta: string, etd: string, status: string) => {
    try {
      let apiUrl = `http://localhost:8099/api/order?customerId=${userId}&page=0&size=4`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (paid) {
        apiUrl += `&paid=${paid}`;
      }
      if (price) {
        apiUrl += `&price=${price}`;
      }
      if (eta) {
        apiUrl += `&eta=${eta}`;
      }
      if (etd) {
        apiUrl += `&etd=${etd}`;
      }
      if (status) {
        apiUrl += `&status=${status}`;
      }
      const response = await axios.get(apiUrl);
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, 300); // Debounce for 300 milliseconds

  //fetch order by userId
  useEffect(() => {
    axios.get("http://localhost:8099/api/order?page=0&size=4&customerId=" + userId)
      .then(response => {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages)
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  //fetch user detail
  useEffect(() => {

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8099/api/user?userId=${userId}`
        );
        const user = response.data.content[0];
        const formattedBirthDate = dayjs(user.birthDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        setFormData({
          ...user,
          birthDate: formattedBirthDate
        });
        setDataReady(true);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  //fetch current truck of user
  useEffect(() => {
    const fetchData = async () => {
      if (dataReady && formData?.role === "DRIVER") {
        try {
          const containerResponse = await axios.get(`http://localhost:8099/api/containertruck/${userId}`);
          setCurrentContainer(containerResponse.data)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [dataReady, formData]);

  //fetch list truck not assign to driver
  useEffect(() => {
    const fetchData = async () => {
      if (dataReady && formData?.role === "DRIVER") {
        try {
          const containerResponse = await axios.get("http://localhost:8099/api/containertruck/notInUse");
          setContainers(containerResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [dataReady, formData]);

  //assign data into form
  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  //submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.truckId && currentContainer?.truckId && formData.truckId != currentContainer?.truckId) {
      axios
        .put(`http://localhost:8099/api/containertruck/${formData.truckId}/driver/${userId}`)

    }

    const updatedFormData = { ...formData };
    if (updatedFormData.birthDate) {
      updatedFormData.birthDate = dayjs(formData.birthDate, 'YYYY-MM-DD').format('DD-MM-YYYY');
    }
    if (formData.birthDate > new Date().toISOString().slice(0, 10)) {
      toast.error('Ngày sinh không thể là ngày trong tương lai!')
    } else {
      axios
        .put(`http://localhost:8099/api/user/${userId}`, updatedFormData)
        .then((response) => {
          toast.success("Cập nhật người dùng thành công!")
          if (formData.role == "CUSTOMER") {
            navigate("/user");
          } else {
            navigate("/employee");
          }

        })
        .catch((error) => {
          console.error("Error creating user:", error);
          toast.error("Cập nhật người dùng thất bại")
        });
    }

  };
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange1} aria-label="basic tabs example">
            <Tab label="Thông tin" {...a11yProps(0)} />
            {formData.role == "CUSTOMER" && <Tab label="Lịch sử đơn hàng" {...a11yProps(1)} />
            }

          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>

          <div>
            <Breadcrumb pageName="Thông tin người dùng" />
            <div className="flex flex-col gap-9">
              {/* <!-- Contact Form --> */}
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                  Thông tin cụ thể
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
                          pattern="[a-zA-Z\s_àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ]+"
                          title="Vui lòng chỉ nhập chữ cái "
                          required
                          value={formData.firstName}
                          maxLength={30}
                          onChange={handleChange}
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
                          title="Vui lòng chỉ nhập chữ cái"
                          value={formData.lastName}
                          onChange={handleChange}

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
                          pattern="[0-9]{12}"
                          required
                          title="Vui lòng nhập 12 chữ số "
                          value={formData.personalId}
                          onChange={handleChange}

                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Địa Chỉ
                        </label>
                        <input
                          type="text"
                          maxLength={30}
                          name="address"
                          value={formData.address}
                          required
                          onChange={handleChange}
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
                          readOnly
                          type="text"
                          required
                          maxLength={30}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}

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
                          required
                          value={formData.phone}
                          onChange={handleChange}

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
                          onChange={handleChange}
                          required
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                      {formData.role != "CUSTOMER" ? <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Lương
                        </label>

                        <input
                          type="number"
                          name="fixedSalary"
                          maxLength={30}
                          title="Vui lòng nhập số "
                          required
                          value={formData.fixedSalary}
                          onChange={handleChange}
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div> : <div className="w-full xl:w-1/2">

                      </div>}

                    </div>
                    {formData?.role === "DRIVER" && (
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Xe
                          </label>

                          <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                            <InputLabel id="label_delect_driver">
                              {currentContainer?.licensePlate}
                            </InputLabel>
                            <Select
                              value={formData.truckId}
                              name="truckId"
                              labelId="label_delect_driver"
                              id="select_driver"
                              label="Tài xế"

                              onChange={handleChange}
                            >
                              {containers &&
                                containers.map((containers) => (
                                  <MenuItem value={containers.truckId}>
                                    {containers.licensePlate}
                                  </MenuItem>
                                ))}

                            </Select>
                          </FormControl>

                        </div>
                      </div>)}

                    <button
                      type="submit"
                      className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray"
                    >
                      Cập nhật
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Breadcrumb pageName="Thông tin đơn hàng" />
          <div className="flex flex-col gap-10">
            <div className="rounded-sm border border-stroke bg-white px-2 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-2.5 xl:pb-1">
              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-secondary hover:cursor-default">
                      <th className="min-w-[40px] px-2 py-2 font-bold text-black dark:text-white xl:pl-3">
                        Mã đơn hàng
                      </th>

                      <th className="min-w-[40px] px-2 py-2 font-bold text-black dark:text-white">
                        Tiền đơn hàng
                      </th>
                      <th className="min-w-[40px] px-2 py-2 font-bold text-black dark:text-white">
                        Eta
                      </th>

                      <th className="min-w-[40px] px-2 py-2 font-bold text-black dark:text-white">
                        Etd
                      </th>
                      <th className="min-w-[40px] px-2 py-2 font-bold text-black dark:text-white">
                        TT thanh toán
                      </th>
                      <th className="min-w-[40px] px-2 py-2 font-bold text-black dark:text-white">
                        Trạng thái
                      </th>


                    </tr>
                    <tr className="bg-secondary hover:cursor-default">
                      <th className="min-w-[40px] py-2 px-2 font-bold text-black dark:text-white xl:pl-3">


                        <input
                          type="text"
                          name="searchOrderNumber"
                          value={orderNumber}
                          onChange={handleSearchOrderNumber}
                          className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                        />

                      </th>

                      <th className="min-w-[40px] py-2 px-2 font-bold text-black dark:text-white">
                        <input
                          type="text"
                          name="searchPrice"
                          value={price}
                          onChange={handleSearchPrice}
                          className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                        />
                      </th>

                      <th className="min-w-[40px] py-2 px-2 font-bold text-black dark:text-white">
                        <input
                          type="date"
                          name="searchetd"
                          value={etd}
                          onChange={handleSearchEtd}
                          className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                        />
                      </th>
                      <th className="min-w-[40px] py-2 px-2 font-bold text-black dark:text-white">
                        <input
                          type="date"
                          name="searcheta"
                          value={eta}
                          onChange={handleSearchEta}
                          className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                        />
                      </th>

                      <th className="min-w-[40px] py-2 px-2 font-bold text-black dark:text-white ">
                        <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                          <InputLabel id="label_filter_status">
                            TT thanh toán
                          </InputLabel>
                          <Select
                            className="bg-white"
                            name="paid"
                            labelId="label_delect_paid"
                            id="select_paid"
                            value={paid !== undefined ? paid : ""}
                            label="Tài xế"
                            onChange={handleSearchPaid}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="true">Đã thanh toán</MenuItem>
                            <MenuItem value="false">Chưa thanh toán</MenuItem>


                          </Select>
                        </FormControl>

                      </th>
                      <th className="min-w-[40px] py-2 px-2 font-bold text-black dark:text-white">
                        <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                          <InputLabel id="label_filter_status">
                            Trạng thái
                          </InputLabel>
                          <Select
                            className="bg-white "
                            name="isActive"
                            labelId="label_delect_driver"
                            id="select_driver"
                            value={status !== undefined ? status : ""}
                            label="Tài xế"
                            onChange={handleSearchStatus}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
                            <MenuItem value="CONFIRM">Đã xác nhận</MenuItem>
                            <MenuItem value="TOSHIP">Đang giao hàng</MenuItem>
                            <MenuItem value="TORECIEVE">Đã nhận hàng</MenuItem>
                            <MenuItem value="COMPLETED">Hoàn thành</MenuItem>

                          </Select>
                        </FormControl>
                      </th>





                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.length > 0 ? (
                      orders.map(order => (
                        <tr className="text-center" key={order.orderId}>
                          <td className="border-b border-[#eee] hover:cursor-pointer  py-2 px-2 pl-2 dark:border-strokedark xl:pl-2">
                            {order.orderNumber && (
                              <p className="text-black ">{order.orderNumber}</p>
                            )}

                          </td>


                          <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                            {order.price && (
                              <p className="text-black ">{order.price}</p>
                            )}

                          </td>


                          <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                            {order.etd && (
                              <p className="text-black "> {moment(order.etd).format('MM-DD-YYYY')} </p>
                            )}
                          </td>
                          <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                            {order.eta && (
                              <p className="text-black "> {moment(order.eta).format('MM-DD-YYYY')} </p>
                            )}
                          </td>
                          <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                            {order.paid ? (
                              <p className="text-black mr-3">Đã thanh toán</p>
                            ) : (
                              <p className="text-black mr-3">Chưa thanh toán</p>
                            )}
                          </td>
                          <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                            <div className="flex items-center">
                              {order.status && order.status == "PENDING" && (
                                <p className="text-black mr-3">Đang xác nhận  </p>
                              )}
                              {order.status && order.status == "CONFIRM" && (
                                <p className="text-black mr-3">Đã xác nhận  </p>
                              )}
                              {order.status && order.status == "TOSHIP" && (
                                <p className="text-black mr-3">Đang giao hàng  </p>
                              )}
                              {order.status && order.status == "TORECIEVE" && (
                                <p className="text-black mr-3">Đã nhận hàng </p>
                              )}
                              {order.status && order.status == "COMPLETED" && (
                                <p className="text-black mr-3">Hoàn thành </p>
                              )}

                            </div>
                          </td>



                          {/* Action */}

                          {/* Action */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No matching records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <br />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Pagination count={totalPages} variant="outlined"
                    onChange={handlePageClick}
                  />

                </Stack>
              </div>
            </div>
          </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>



    </>
  );
};

export default EditUser;
