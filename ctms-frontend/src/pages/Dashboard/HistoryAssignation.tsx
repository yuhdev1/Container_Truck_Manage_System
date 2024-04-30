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
const HistoryAssignation = () => {
  const user = useAuth();
  const axios = useAxiosAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [eta, setEta] = useState("");
  const [etd, setEtd] = useState("");

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [schedules, setSchedules] = useState<schedule[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8099/api/schedule?page=0&size=7`)
      .then((response) => {
        setSchedules(response.data.content);
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
      let apiUrl = `http://localhost:8099/api/schedule?page=${page - 1}&size=7`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (customerNumber) {
        apiUrl += `&customerNumber=${customerNumber}`;
      }
      if (driverNumber) {
        apiUrl += `&driverNumber=${driverNumber}`;
      }
      if (licensePlate) {
        apiUrl += `&licensePlate=${licensePlate}`;
      }
      if (etd) {
        apiUrl += `&from=${etd}`;
      }
      if (eta) {
        apiUrl += `&to=${eta}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          setSchedules(response.data.content);
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
    debouncedSearch(
      inputValue,
      customerNumber,
      driverNumber,
      licensePlate,
      etd,
      eta
    );
  };
  const handleSearchCustomerNumber = async (
    event: SelectChangeEvent<string>
  ) => {
    const inputValue = event.target.value;
    setCustomerNumber(inputValue);
    debouncedSearch(
      orderNumber,
      inputValue,
      driverNumber,
      licensePlate,
      etd,
      eta
    );
  };
  const handleSearchDriverNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setDriverNumber(inputValue);
    debouncedSearch(
      orderNumber,
      customerNumber,
      inputValue,
      licensePlate,
      etd,
      eta
    );
  };
  const handleSearchLicensePlate = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setLicensePlate(inputValue);
    debouncedSearch(
      orderNumber,
      customerNumber,
      driverNumber,
      inputValue,
      etd,
      eta
    );
  };
  const handleSearchEtd = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEtd(inputValue);
    debouncedSearch(
      orderNumber,
      customerNumber,
      driverNumber,
      licensePlate,
      inputValue,
      eta
    );
  };
  const handleSearchEta = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEta(inputValue);
    debouncedSearch(
      orderNumber,
      customerNumber,
      driverNumber,
      licensePlate,
      etd,
      inputValue
    );
  };

  const debouncedSearch = debounce(
    async (
      orderNumber: string,
      customerNumber: string,
      driverNumber: string,
      licensePlate: string,
      etd: string,
      eta: string
    ) => {
      try {
        let apiUrl = `http://localhost:8099/api/schedule?page=0&size=7`;

        if (orderNumber) {
          apiUrl += `&orderNumber=${orderNumber}`;
        }
        if (customerNumber) {
          apiUrl += `&customerNumber=${customerNumber}`;
        }
        if (driverNumber) {
          apiUrl += `&driverNumber=${driverNumber}`;
        }
        if (licensePlate) {
          apiUrl += `&licensePlate=${licensePlate}`;
        }
        if (etd) {
          apiUrl += `&from=${etd}`;
        }
        if (eta) {
          apiUrl += `&to=${eta}`;
        }

        const response = await axios.get(apiUrl);
        setSchedules(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    300
  ); // Debounce for 300 milliseconds

  return (
    <>
      <Breadcrumb pageName="Lịch sử điều phối" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-2 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-2.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white xl:pl-5">
                    Mã đơn hàng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã khách hàng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã tài xế
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Biển số xe
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    ETD
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    ETA
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Thời gian điều phối
                  </th>

                  {/* <th className="py-1 px-1 font-bold text-black dark:text-white"></th> */}
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white xl:pl-1">
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
                      name="searchCustomerNumber"
                      value={customerNumber}
                      onChange={handleSearchCustomerNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="text"
                      name="searchDriverNumber"
                      value={driverNumber}
                      onChange={handleSearchDriverNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="text"
                      name="searchlicensePlate"
                      value={licensePlate}
                      onChange={handleSearchLicensePlate}
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
                    <input
                      type="datetime-local"
                      name="searcheta1"
                      readOnly
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  {/* <th className="py-1 px-1 font-bold text-black dark:text-white"></th> */}
                </tr>
              </thead>
              <tbody>
                {schedules && schedules.length > 0 ? (
                  schedules.map((schedulecac) => (
                    <tr className="text-center" key={schedulecac.id}>
                      <td className="border-b border-[#eee] hover:cursor-pointer  py-5 px-4 pl-9 dark:border-strokedark xl:pl-1">
                        <h5 className="font-medium hover:text-primary text-black dark:text-white">
                          {schedulecac.order?.orderNumber && (
                            <p className="text-black ">
                              {schedulecac.order.orderNumber}
                            </p>
                          )}
                        </h5>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {schedulecac.order?.customer?.userNumber && (
                          <p className="text-black ">
                            {schedulecac.order.customer.userNumber}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {schedulecac.driver?.userNumber && (
                          <p className="text-black ">
                            {schedulecac.driver.userNumber}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {schedulecac.containerTruck?.licensePlate && (
                          <p className="text-black ">
                            {schedulecac.containerTruck.licensePlate}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {schedulecac.order?.etd && (
                          <p className="text-black ">
                            {moment(schedulecac.order.etd).format("MM-DD-YYYY")}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {schedulecac.order?.eta && (
                          <p className="text-black ">
                            {moment(schedulecac.order.eta).format("MM-DD-YYYY")}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {schedulecac.time_stamp && (
                          <p className="text-black ">
                            {moment(schedulecac.time_stamp).format(
                              "MM-DD-YYYY HH:mm"
                            )}
                          </p>
                        )}
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

export default HistoryAssignation;
