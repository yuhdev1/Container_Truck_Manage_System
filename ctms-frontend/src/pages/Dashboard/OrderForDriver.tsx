import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import { order } from "../../model/order";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import moment from "moment";
import useAuth from "../../libs/hook/useAuth";
import { schedule } from "../../model/shedule";
const OrderForDriver = () => {
  const user = useAuth();
  const axios = useAxiosAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [eta, setEta] = useState("");
  const [etd, setEtd] = useState("");
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [schedule, setOrders] = useState<schedule[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:8099/api/schedule?page=0&size=4&driverId=${user.userId}`
      )
      .then((response) => {
        setOrders(response.data.content);
        setTotalUsers(response.data.totalElements);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handlePageClick = (event: any, page: number) => {
    setCurrentPage(page);
    try {
      let apiUrl = `http://localhost:8099/api/schedule?page=${page - 1}&size=4&driverId=${user.userId}`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (fullName) {
        apiUrl += `&fullName=${fullName}`;
      }
      if (phone) {
        apiUrl += `&phone=${phone}`;
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
          setTotalUsers(response.data.totalElements);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  //
  const handleSearchOrderNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setOrderNumber(inputValue);
    debouncedSearch(inputValue, fullName, phone, eta, etd, status);
  };
  const handleSearchName = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setFullName(inputValue);
    debouncedSearch(orderNumber, inputValue, phone, eta, etd, status);
  };
  const handleSearchUserPhone = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setPhone(inputValue);
    debouncedSearch(orderNumber, fullName, inputValue, eta, etd, status);
  };
  const handleSearchEta = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEta(inputValue);
    debouncedSearch(orderNumber, fullName, phone, inputValue, etd, status);
  };
  const handleSearchEtd = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEtd(inputValue);
    debouncedSearch(orderNumber, fullName, phone, eta, inputValue, status);
  };
  const handleSearchStatus = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setStatus(inputValue);
    debouncedSearch(orderNumber, fullName, phone, eta, etd, inputValue);
  };


  const debouncedSearch = debounce(
    async (orderNumber: string, fullName: string, phone: string, eta: string, etd: string, status: string) => {
      try {
        let apiUrl = `http://localhost:8099/api/schedule?page=${currentPage - 1}&size=4&driverId=${user.userId}`;

        if (orderNumber) {
          apiUrl += `&orderNumber=${orderNumber}`;
        }
        if (fullName) {
          apiUrl += `&fullName=${fullName}`;
        }
        if (phone) {
          apiUrl += `&phone=${phone}`;
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
        <div className="rounded-sm border border-stroke bg-white px-2 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white xl:pl-5">
                    Mã đơn hàng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Khách hàng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Số điện thoại
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    ETD
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    ETA
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Trạng thái
                  </th>

                  <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white xl:pl-5">
                    <input
                      type="text"
                      name="searchPersonalId"
                      value={orderNumber}
                      onChange={handleSearchOrderNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="text"
                      name="searchName"
                      value={fullName}
                      onChange={handleSearchName}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="text"
                      name="searchPhone"
                      value={phone}
                      onChange={handleSearchUserPhone}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="date"
                      name="searchetd"
                      value={etd}
                      onChange={handleSearchEtd}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="date"
                      name="searcheta"
                      value={eta}
                      onChange={handleSearchEta}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
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

                  <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                </tr>
              </thead>
              <tbody>
                {schedule && schedule.length > 0 ? (
                  schedule.map((schedulecac) => (
                    <tr className="text-center" key={schedulecac.id}>
                      <td className="border-b border-[#eee] hover:cursor-pointer  py-1 px-1 pl-9 dark:border-strokedark xl:pl-5"  >
                        <h5 className="font-medium hover:text-primary text-black dark:text-white">
                          {schedulecac.order?.orderNumber && (
                            <p className="text-black ">
                              {schedulecac.order.orderNumber}
                            </p>
                          )}
                        </h5>
                      </td>

                      <td className="border-b border-[#eee] py-1 px-1 dark:border-strokedark">
                        {schedulecac.order?.customer?.firstName && (
                          <p className="text-black ">
                            {schedulecac.order.customer.firstName}{" "}
                            {schedulecac.order.customer.lastName}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-1 px-1 dark:border-strokedark">
                        {schedulecac.order?.customer?.phone && (
                          <p className="text-black ">
                            {schedulecac.order.customer.phone}
                          </p>
                        )}
                      </td>


                      <td className="border-b border-[#eee] py-1 px-1 dark:border-strokedark">
                        {schedulecac.order?.etd && (
                          <p className="text-black ">
                            {" "}
                            {moment(schedulecac.order.etd).format(
                              "MM-DD-YYYY"
                            )}{" "}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-1 px-1 dark:border-strokedark">
                        {schedulecac.order?.eta && (
                          <p className="text-black ">
                            {" "}
                            {moment(schedulecac.order.eta).format(
                              "MM-DD-YYYY"
                            )}{" "}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-1 px-1 dark:border-strokedark">
                        <div className="flex items-center">
                          {schedulecac.order?.status && schedulecac.order?.status == "PENDING" && (
                            <p className="text-black mr-3">Chờ xác nhận  </p>
                          )}
                          {schedulecac.order?.status && schedulecac.order?.status == "CONFIRM" && (
                            <p className="text-black mr-3">Đã xác nhận  </p>
                          )}
                          {schedulecac.order?.status && schedulecac.order?.status == "TOSHIP" && (
                            <p className="text-black mr-3">Đang vận chuyển  </p>
                          )}
                          {schedulecac.order?.status && schedulecac.order?.status == "TORECIEVE" && (
                            <p className="text-black mr-3">Đã nhận hàng </p>
                          )}
                          {schedulecac.order?.status && schedulecac.order?.status == "COMPLETED" && (
                            <p className="text-black mr-3">Hoàn thành </p>
                          )}

                        </div>
                      </td>
                      <td className="border-b border-[#eee] py-1 px-1 dark:border-strokedark">
                        <div className="flex items-center">

                          <button
                            onClick={() =>
                              navigate(
                                "/orderdetailfordriver/" +
                                schedulecac.order?.orderId
                              )
                            }
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

export default OrderForDriver;
