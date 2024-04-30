import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { QUERY_KEY, ROLE } from "../../libs/constant";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import timezonedDayjs from "../../libs/dayjstz";
import { HandoverContractResponse } from "../../model/contract";
import {
  ContainerTruck,
  ContainerTruckResponse,
} from "../../model/container_truck";
import { _User } from "../../model/truck";
import { GetUserResponse } from "../../model/invoice";
import { SelectChangeEvent, Tooltip } from "@mui/material";

const HandoverContract = () => {
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [lisenceFilter, setLisenceFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");
  const [contractNumberFilter, setContractNumberFilter] = useState("");
  const [userNumberFilter, setUserNumberFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [drivers, setDrivers] = useState<_User[]>([]);
  const [trucks, setTrucks] = useState<ContainerTruck[]>();
  const navigate = useNavigate();
  const httpClient = useAxiosAuth();

  useEffect(() => {
    const trucks = fetchTruckData();
    trucks.then((truck) => {
      truck && setTrucks(truck.containerTrucks);
    });
    const drivers = fetchDriverData();
    drivers.then((driver) => {
      driver && setDrivers(driver.content);
    });
  }, []);

  const fetchDriverData = async () =>
    await httpClient
      .get<GetUserResponse>("/api/user", {
        params: {
          pageSize: 1000,
          isActive: true,
          role: ROLE.DRIVER,
        },
      })
      .then((res: AxiosResponse<GetUserResponse>) => {
        // console.log("Result: " + JSON.stringify(res.data));
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
      });

  const fetchTruckData = () =>
    httpClient
      .get<ContainerTruckResponse>("/api/containertruck", {
        params: {
          pageSize: 1000,
          isActive: true,
        },
      })
      .then((res: AxiosResponse<ContainerTruckResponse>) => {
        // console.log("Result: " + JSON.stringify(res.data));
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
      });

  const fetchContractData = async (page: number) =>
    await httpClient
      .get<HandoverContractResponse>("/api/contract/vehicalhandover", {
        params: {
          page: page - 1,
          pageSize: 7,
          licensePlate: lisenceFilter,
          contractNumber: contractNumberFilter,
          userId: driverFilter,
          startDate:
            startDate && timezonedDayjs(startDate).format("DD-MM-YYYY"),
          endDate: endDate && timezonedDayjs(endDate).format("DD-MM-YYYY"),
          userNumber: userNumberFilter,
        },
      })
      .then((res: AxiosResponse<HandoverContractResponse>) => {
        setTotalPages(res.data.totalPage);

        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
      });
  const { data } = useQuery({
    queryKey: [
      QUERY_KEY.CONTAINER_TRUCK,
      page,
      lisenceFilter,
      driverFilter,
      startDate,
      endDate,
      contractNumberFilter,
      userNumberFilter,
    ],
    queryFn: () => fetchContractData(page),
  });
  const clearFilter = () => {
    setLisenceFilter("");
    setUserNumberFilter("");
    setDriverFilter("");
    setStartDate("");
    setEndDate("");
    setContractNumberFilter("");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <form>
          <div className="relative border-0">
            <p className="text-black font-semibold text-2xl">
              Danh sách hợp đồng bàn giao
            </p>
          </div>
        </form>
        <div>
          <Link
            to="new"
            className="inline-flex items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6"
          >
            + Tạo mới
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10 mt-2">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto  text-black">
            <table className="w-full table-auto ">
              <thead className="bg-secondary hover:cursor-default">
                <tr className="text-center dark:bg-meta-4 ">
                  <th className="min-w-[80px] py-4 px-4 font-bold">
                    Mã hợp đồng
                  </th>
                  <th className="min-w-[250px] py-4 px-4 font-bold">Tài xế</th>
                  <th className=" py-4 px-4 font-bold">Mã tài xế</th>
                  <th className="py-4 px-4 font-bold">Xe (Biển số)</th>
                  <th className="min-w-[80px] py-4 px-4 font-bold">Ngày kí</th>
                  <th className="min-w-[80px] py-4 px-4 font-bold">
                    Ngày hết hạn
                  </th>
                  <th className="py-4 px-4 font-bold"></th>
                </tr>
                {/* Search */}
                <tr className="text-center items-center dark:bg-meta-4">
                  <th className="px-3 pb-2">
                    <input
                      type="text"
                      name="contractNumberFilter"
                      className="w-full bg-white focus:outline-none border-0 rounded-md font-normal"
                      value={contractNumberFilter}
                      onChange={(e) => {
                        setContractNumberFilter(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2">
                    <select
                      value={driverFilter}
                      onChange={(e) => {
                        setDriverFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 pb-2 w-full rounded-lg border-0 outline-none font-normal"
                    >
                      <option className="border-0 outline-none" value="">
                        None
                      </option>
                      {drivers &&
                        drivers.length > 0 &&
                        drivers.map((driver, index) => (
                          <option
                            key={index}
                            className="border-0 outline-none w-full"
                            value={driver.userId}
                          >
                            {driver?.firstName + " " + driver?.lastName}
                          </option>
                        ))}
                    </select>
                  </th>
                  <th className="px-3 pb-2">
                    <input
                      type="text"
                      name="userNumberFilter"
                      className="w-full bg-white focus:outline-none border-0 rounded-md font-normal"
                      value={userNumberFilter}
                      onChange={(e) => {
                        setUserNumberFilter(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2 min-w-[200px]">
                    <select
                      value={lisenceFilter}
                      onChange={(e) => {
                        setLisenceFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 pb-2 w-full rounded-lg border-0 outline-none font-normal"
                    >
                      <option className="border-0 outline-none" value="">
                        None
                      </option>
                      {trucks &&
                        trucks.length > 0 &&
                        trucks.map((truck, index) => (
                          <option
                            key={index}
                            className="border-0 outline-none w-full"
                            value={truck.licensePlate}
                          >
                            {truck.licensePlate}
                          </option>
                        ))}
                    </select>
                  </th>
                  <th className="px-3 pb-2">
                    <input
                      type="date"
                      name="providerFilter"
                      className="custom-input-date custom-input-date-1 w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2">
                    <input
                      name="registrationDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setPage(1);
                      }}
                      className="custom-input-date custom-input-date-1 w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                    />
                  </th>
                  <th className="px-3 pb-2">
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
                          fill="currentColor"
                          d="M14.76 20.83L17.6 18l-2.84-2.83l1.41-1.41L19 16.57l2.83-2.81l1.41 1.41L20.43 18l2.81 2.83l-1.41 1.41L19 19.4l-2.83 2.84zM12 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0L8.29 18.7a.99.99 0 0 1-.29-.83V12h-.03L2.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L12.03 12z"
                        ></path>
                      </svg>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody className="hover:cursor-default">
                {data && data.vehicalHandoverContracts.length > 0 ? (
                  data.vehicalHandoverContracts.map((contract, index) => (
                    <tr key={index} className="hover:bg-stroke text-center">
                      <td className=" border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {contract.contractNumber
                            ? contract.contractNumber
                            : "N/A"}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {contract.driver && (
                          <p className="text-black ">
                            {contract.driver?.firstName +
                              " " +
                              contract.driver?.lastName}
                          </p>
                        )}
                        {!contract.driver && (
                          <p className="text-black text-center">N/A</p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {contract.driver && (
                          <p className="text-black ">
                            {contract.driver?.userNumber}
                          </p>
                        )}
                        {!contract.driver && (
                          <p className="text-black text-center">N/A</p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {contract.truck?.licensePlate
                            ? contract.truck.licensePlate
                            : "N/A"}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {contract.startDate
                            ? timezonedDayjs(contract.startDate).format(
                                "DD-MM-YYYY"
                              )
                            : "N/A"}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {contract.endDate
                            ? timezonedDayjs(contract.endDate).format(
                                "DD-MM-YYYY"
                              )
                            : "N/A"}
                        </p>
                      </td>
                      {/* Action */}
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() =>
                              navigate(
                                "/contract/handover/" +
                                  contract.handingContractId
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
                    </tr>
                  ))
                ) : (
                  <div className="text-black mt-4 ">
                    <p>Không có kết quả!</p>
                  </div>
                )}
              </tbody>
            </table>
            <br />
            <div className="bottom-0 mt-2">
              <Stack direction="row" spacing={2} justifyContent="center">
                <Pagination
                  count={totalPages === 0 ? 1 : totalPages}
                  variant="outlined"
                  onChange={(event, page) => setPage(page)}
                />
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HandoverContract;
