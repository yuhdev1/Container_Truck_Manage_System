import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import { order } from "../../model/order";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import moment from "moment";
const Order = () => {
  const axios = useAxiosAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [eta, setEta] = useState("");
  const [etd, setEtd] = useState("");
  const [status, setStatus] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [orders, setOrders] = useState<order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const clearFilter = () => {
    setOrderNumber("");
    setUserNumber("");
    setFullName("");
    setEta("");
    setStatus("");
    setEtd("");
    debouncedSearch("", "", "", "", "", "");
  };
  //fetch data of order
  useEffect(() => {
    axios
      .get("http://localhost:8099/api/order?page=0&size=7")
      .then((response) => {
        setOrders(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  //Pagination
  const handlePageClick = (event: any, page: number) => {
    setCurrentPage(page);
    try {
      let apiUrl = `http://localhost:8099/api/order?page=${page - 1}&size=7`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (userNumber) {
        apiUrl += `&userNumber=${userNumber}`;
      }
      if (fullName) {
        apiUrl += `&fullName=${fullName}`;
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
      axios
        .get(apiUrl)
        .then((response) => {
          setOrders(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //Searching
  const handleSearchOrderNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setOrderNumber(inputValue);
    debouncedSearch(inputValue, userNumber, fullName, eta, etd, status);
  };
  const handleSearchUserNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setUserNumber(inputValue);
    debouncedSearch(orderNumber, inputValue, fullName, eta, etd, status);
  };
  const handleSearchName = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setFullName(inputValue);
    debouncedSearch(orderNumber, userNumber, inputValue, eta, etd, status);
  };
  const handleSearchEtd = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEtd(inputValue)
    debouncedSearch(orderNumber, userNumber, fullName, inputValue, eta, status);
  };
  const handleSearchEta = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEta(inputValue)
    debouncedSearch(orderNumber, userNumber, fullName, etd, inputValue, status);
  };
  const handleSearchStatus = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setStatus(inputValue);
    debouncedSearch(orderNumber, userNumber, fullName, eta, etd, inputValue);
  };
  const debouncedSearch = debounce(async (orderNumber: string, userNumber: string, fullName: string, etd: string, eta: string, status: string) => {
    try {
      let apiUrl = `http://localhost:8099/api/order?page=0&size=7`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (userNumber) {
        apiUrl += `&userNumber=${userNumber}`;
      }
      if (fullName) {
        apiUrl += `&fullName=${fullName}`;
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
      console.error("Error fetching users:", error);
    }
  },
    300
  ); // Debounce for 300 milliseconds

  return (
    <>
      <Breadcrumb pageName="Quản lí đơn hàng" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-2 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-2.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white xl:pl-11">
                    Mã đơn hàng
                  </th>
                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã khách hàng
                  </th>
                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white">
                    Khách hàng
                  </th>
                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white">
                    Etd
                  </th>

                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white">
                    Eta
                  </th>
                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white">
                    Trạng thái đơn hàng
                  </th>

                  <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white xl:pl-11">
                    <input
                      type="text"
                      name="searchOrderNumber"
                      value={orderNumber}
                      onChange={handleSearchOrderNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white ">
                    <input
                      type="text"
                      name="searchUserNumber"
                      value={userNumber}
                      onChange={handleSearchUserNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <input
                      type="text"
                      name="searchname"
                      value={fullName}
                      onChange={handleSearchName}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <input
                      type="date"
                      name="searcheta"
                      value={etd}
                      onChange={handleSearchEtd}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <input
                      type="date"
                      name="searchetd"
                      value={eta}
                      onChange={handleSearchEta}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
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
                        <MenuItem value="TOSHIP">Đang vận chuyển</MenuItem>
                        <MenuItem value="TORECIEVE">Đã nhận hàng</MenuItem>
                        <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                      </Select>
                    </FormControl>
                  </th>

                  <th className="py-2 px-2 font-bold text-black dark:text-white">
                    <Tooltip title="Bỏ Lọc">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.5em"
                        height="1.5em"
                        viewBox="0 0 24 24"
                        className="hover cursor-pointer"
                        onClick={clearFilter}
                      >
                        <path
                          fill="black"
                          d="M14.76 20.83L17.6 18l-2.84-2.83l1.41-1.41L19 16.57l2.83-2.81l1.41 1.41L20.43 18l2.81 2.83l-1.41 1.41L19 19.4l-2.83 2.84zM12 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0L8.29 18.7a.99.99 0 0 1-.29-.83V12h-.03L2.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L12.03 12z"
                        ></path>
                      </svg>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr className="text-center" key={order.orderId}>
                      <td className="border-b border-[#eee] hover:cursor-pointer  py-2 px-2 pl-2.5 dark:border-strokedark xl:pl-5">
                        <h5 className="font-medium hover:text-primary text-black dark:text-white">
                          {order.orderNumber && (
                            <p className="text-black ">{order.orderNumber}</p>
                          )}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {order.customer?.userNumber && (
                          <p className="text-black ">
                            {order.customer.userNumber}{" "}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {order.customer?.firstName && (
                          <p className="text-black ">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {order.etd && (
                          <p className="text-black ">
                            {" "}
                            {moment(order.etd).format("DD-MM-YYYY")}{" "}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {order.eta && (
                          <p className="text-black ">
                            {" "}
                            {moment(order.eta).format("DD-MM-YYYY")}{" "}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        <div className="flex items-center">
                          {order.status && order.status == "PENDING" && (
                            <p className="text-black mr-3">Chờ xác nhận </p>
                          )}
                          {order.status && order.status == "CONFIRM" && (
                            <p className="text-black mr-3">Đã xác nhận </p>
                          )}
                          {order.status && order.status == "TOSHIP" && (
                            <p className="text-black mr-3">Đang vận chuyển </p>
                          )}
                          {order.status && order.status == "TORECIEVE" && (
                            <p className="text-black mr-3">Đã nhận hàng </p>
                          )}
                          {order.status && order.status == "COMPLETED" && (
                            <p className="text-black mr-3">Hoàn thành </p>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        <button
                          onClick={() => navigate("/neworder/" + order.orderId)}
                          className="hover:text-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
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
              <Pagination
                count={totalPages}
                variant="outlined"
                onChange={handlePageClick}
              />
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
