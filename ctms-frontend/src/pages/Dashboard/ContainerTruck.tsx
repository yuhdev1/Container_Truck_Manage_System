import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { ContainerTruckResponse } from "../../model/truck";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CONTAINER_STATUS, QUERY_KEY } from "../../libs/constant";
import {
  Box,
  Button,
  Modal,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from "@mui/material";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import dayjs from "dayjs";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "60%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const ContainerTruck = () => {
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState("");
  const [lisenceFilter, setLisenceFilter] = useState("");
  const [driverFilter, setDriverFilter] = useState("");
  const [weightFilter, setWeightFilter] = useState("");
  const [userNumberFilter, setUserNumberFilter] = useState("");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [changeStatusTruck, setChangeStatusTruck] = useState("");
  const httpClient = useAxiosAuth();
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  dayjs.extend(customParseFormat);
  const handleClickOpen = (truckId: string) => {
    setChangeStatusTruck(truckId);
    setOpen(true);
  };

  const changeTruckStatus = () =>
    httpClient.put("/api/containertruck/" + changeStatusTruck);

  const changeStatusMutation = useMutation({
    mutationFn: () => changeTruckStatus(),
    onSuccess: (res) => {
      setChangeStatusTruck("");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.CONTAINER_TRUCK],
      });
      setOpen(false);
      toast.success("Đổi trạng thái xe thành công");
    },
    onError: function (error) {
      toast.error("Something went wrong!");
    },
  });
  const handleClose = () => {
    setOpen(false);
  };

  // const formatIsActive = (activeFilter: string) => {
  //   if (activeFilter === "") return null;
  //   return activeFilter === "" ? true : false;
  // };

  const fetchTruckData = async (page: number, searchQuery: string) =>
    await httpClient
      .get<ContainerTruckResponse>("/api/containertruck", {
        params: {
          page: page - 1,
          pageSize: 7,
          license_plate: lisenceFilter,
          container_status: activeFilter,
          full_name: driverFilter,
          capacity: weightFilter,
          user_number: userNumberFilter,
        },
      })
      .then((res: AxiosResponse<ContainerTruckResponse>) => {
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
      activeFilter,
      driverFilter,
      userNumberFilter,
      weightFilter,
    ],
    queryFn: () => fetchTruckData(page, lisenceFilter),
  });
  const handleNumberChange = (e: SelectChangeEvent<string>) => {
    if (e.target.value !== "" && e.target.value !== undefined) {
      const value = Math.max(0, Math.min(9999999999, Number(e.target.value)));
      setWeightFilter(value.toString());
    } else setWeightFilter(e.target.value);
    setPage(1);
  };

  const clearFilter = () => {
    setWeightFilter("");
    setUserNumberFilter("");
    setDriverFilter("");
    setLisenceFilter("");
    setUserNumberFilter("");
    setActiveFilter("");
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backdropFilter: "blur(5px)" }}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold" }}
          >
            Thông báo!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }}>
            Bạn có muốn đổi trạng thái xe không ?
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              sx={{ ml: 1 }} // Đặt margin-left cho Button đầu tiên để tạo khoảng cách với Button thứ hai
              onClick={() => changeStatusMutation.mutate()}
            >
              Có
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ ml: 1 }}
              onClick={() => handleClose()}
            >
              Không
            </Button>
          </Box>
        </Box>
      </Modal>
      <div className="flex items-center justify-between">
        <form>
          <div className="relative border-0">
            <p className="text-black font-semibold text-2xl">QUẢN LÝ XE</p>
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
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-5 xl:pb-1">
          <div className="max-w-full overflow-x-auto  text-black">
            <table className="w-full table-auto ">
              <thead className="bg-secondary hover:cursor-default">
                <tr className="text-center dark:bg-meta-4 ">
                  <th className="min-w-[150px] py-2 px-4 font-bold">
                    Biển số xe
                  </th>
                  <th className="min-w-[150px] py-2 px-4 font-bold">Tài xế</th>
                  <th className="min-w-[150px] py-2 px-4 font-bold">
                    Mã tài xế
                  </th>
                  <th className="min-w-[70px] py-2 px-4 font-bold">
                    Tải trọng(KG)
                  </th>
                  <th className="min-w-[150px] py-2 px-4 font-bold">
                    Trạng thái
                  </th>
                  <th className="py-2 px-4 font-bold"></th>
                </tr>
                {/* Search */}
                <tr className="text-center items-center dark:bg-meta-4">
                  <th className="px-3 pb-2">
                    <input
                      type="text"
                      name="lisenceFilter"
                      className="w-full bg-white focus:outline-none border-0 rounded-md font-normal"
                      value={lisenceFilter}
                      onChange={(e) => {
                        setLisenceFilter(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2">
                    <input
                      type="text"
                      name="driverFilter"
                      className="w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                      value={driverFilter}
                      onChange={(e) => {
                        setDriverFilter(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2">
                    <input
                      type="text"
                      name="userNumberFilter"
                      className="w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                      value={userNumberFilter}
                      onChange={(e) => {
                        setUserNumberFilter(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2 max-w-[100px]">
                    <input
                      type="number"
                      name="providerFilter"
                      className="w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                      value={weightFilter}
                      onChange={handleNumberChange}
                      onKeyDown={(e) =>
                        exceptThisSymbols.includes(e.key) && e.preventDefault()
                      }
                    />
                  </th>
                  <select
                    value={activeFilter}
                    onChange={(e) => {
                      setActiveFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 pb-2 w-full rounded-lg border-0 outline-none"
                  >
                    {/* <input
                      type="text"
                      name="searchPersonalId"
                      className="w-full  focus:outline-none border-0 font-normal rounded-md"
                    /> */}
                    <option className="border-0 outline-none" value="">
                      None
                    </option>
                    <option className="border-0 outline-none" value="ACTIVE">
                      Đang vận chuyển
                    </option>
                    <option className="border-0 outline-none" value="READY">
                      Sẵn sàng
                    </option>
                    <option className="border-0 outline-none" value="INACTIVE">
                      Ngưng hoạt động
                    </option>
                  </select>
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
                {data && data.containerTrucks.length > 0 ? (
                  data.containerTrucks.map((truck, index) => (
                    <tr key={index} className="hover:bg-stroke text-center">
                      <td className=" border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {truck.licensePlate ? truck.licensePlate : ""}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {truck.driver && (
                          <p className="text-black ">
                            {truck.driver?.firstName +
                              " " +
                              truck.driver?.lastName}
                          </p>
                        )}
                        {!truck.driver && (
                          <p className="text-black text-center">N/A</p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {truck.driver && (
                          <p className="text-black ">
                            {truck.driver.userNumber}
                          </p>
                        )}
                        {!truck.driver && (
                          <p className="text-black text-center">N/A</p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {truck.capacity ? truck.capacity.toLocaleString() : 0}
                        </p>
                      </td>
                      {/* Status */}
                      <td className="flex flex-auto border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {truck.containerStatus === CONTAINER_STATUS.ACTIVE && (
                          <p className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                            Đang vận chuyển
                          </p>
                        )}
                        {truck.containerStatus === CONTAINER_STATUS.READY && (
                          <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                            Sẵn sàng
                          </p>
                        )}
                        {truck.containerStatus ===
                          CONTAINER_STATUS.INACTIVE && (
                          <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                            Ngưng hoạt động
                          </p>
                        )}

                        {truck.containerStatus === CONTAINER_STATUS.ACTIVE &&
                          truck.orderId && (
                            <Link
                              to={"/admin/order/" + truck.orderId}
                              className="hover:text-primary"
                            >
                              <Tooltip title="Xem đơn hàng">
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
                                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                                  />
                                </svg>
                              </Tooltip>
                            </Link>
                          )}
                      </td>
                      {/* Status */}

                      {/* Action */}
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() => navigate("/truck/" + truck.truckId)}
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

export default ContainerTruck;
