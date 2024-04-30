import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GetOrderResponse,
  GetUserResponse,
  OrderInvoiceResponse,
  _Order,
} from "../../model/invoice";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { PAYMENT_METHOD, QUERY_KEY, ROLE } from "../../libs/constant";
import { _User } from "../../model/truck";
import dayjs from "dayjs";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import timezonedDayjs from "../../libs/dayjstz";
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
function OrderInvoice() {
  const [searchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [invoiceNumberFilter, setInvoiceNumberFilter] = useState("");
  const [costFilter, setCostFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [customerNumberFilter, setCustomerNumberFilter] = useState("");
  const [customers, setCustomers] = useState<_User[]>([]);
  const [orders, setOrders] = useState<_Order[]>([]);
  const httpClient = useAxiosAuth();
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const [open, setOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const acceptThisExtensions = ["xlsx"];
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();

  const handleFileChange = async (e: SelectChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const fl = files[0];
      const extension = fl.name.toLowerCase().split(".").pop();
      if (extension && !acceptThisExtensions.includes(extension)) {
        toast.error("Chỉ chấp nhận file xlsx");
        e.target.value = "";
        return;
      }
      if (fl.size / 1024 > 3000) {
        alert("Kích thước file phải nhỏ hơn 3MB");
        e.target.value = "";
        return;
      }
      setFile(fl);
      handleOpenUpload();
      e.target.value = "";
    }
  };
  const importData = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await httpClient
        .post("/api/invoice/order/upload", formData)
        .then((res) => {
          toast.success("Nhập dữ liệu hoá đơn thành công!");
        })
        .catch((err) => toast.error("Nhập dữ liệu hoá đơn thất bại!"));
    }
    handleCloseUpload();
    window.location.reload();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleCloseUpload = () => {
    setOpenUpload(false);
  };

  const handleOpenUpload = () => {
    setOpenUpload(true);
  };
  const downloadSample = async () => {
    await httpClient
      .get("api/blob/download", {
        params: {
          filename: "excel_sample/order.xlsx",
        },
        responseType: "blob",
      })
      .then((res) => {
        console.log(res.data);
        const file = new Blob([res.data]);

        let url = window.URL.createObjectURL(file);
        let a = document.createElement("a");
        a.href = url;
        a.download = "order.xlsx";
        a.click();
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        }
        if (reason.response!.status === 481) {
          toast.error("Tải file thất bại!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        return reason.response!.status;
      });
  };
  const exportData = async () => {
    await httpClient
      .get("api/invoice/order/download", { responseType: "arraybuffer" })
      .then((res) => {
        const file = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        let url = window.URL.createObjectURL(file);
        let a = document.createElement("a");
        a.href = url;
        a.download =
          "hoadonvanchuyen_" + dayjs().format("YYYY-MM-DD") + ".xlsx";
        a.click();
        a.remove();
        handleClose();
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        }
        if (reason.response!.status === 481) {
          toast.error("Tải file thất bại!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        return reason.response!.status;
      });
  };
  useEffect(() => {
    const drivers = fetchCustomerData();
    drivers.then((driver) => {
      driver && setCustomers(driver.content);
    });
    const orders = fetchOrderData();
    orders.then((order) => {
      order && setOrders(order.content);
    });
  }, []);

  const { error, data, isFetching } = useQuery({
    queryKey: [
      QUERY_KEY.ORDER_INVOICE,
      page,
      paymentFilter,
      customerFilter,
      invoiceNumberFilter,
      customerNumberFilter,
      dateFilter,
      costFilter,
      orderFilter,
    ],
    queryFn: () => fetchOrderInvoiceData(page),
  });
  const clearFilter = () => {
    setPaymentFilter("");
    setCustomerFilter("");
    setInvoiceNumberFilter("");
    setDateFilter("");
    setCustomerFilter("");
    setCostFilter("");
    setOrderFilter("");
  };
  const handleNumberChange = (e: SelectChangeEvent<string>) => {
    if (e.target.value !== "" && e.target.value !== undefined) {
      const value = Math.max(0, Math.min(9999999999, Number(e.target.value)));
      setCostFilter(value.toString());
    } else setCostFilter(e.target.value);
    setPage(1);
  };

  const fetchOrderData = () =>
    httpClient
      .get<GetOrderResponse>("/api/order", {
        params: {
          pageSize: 1000,
        },
      })
      .then((res: AxiosResponse<GetOrderResponse>) => {
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

  const fetchCustomerData = async () =>
    await httpClient
      .get<GetUserResponse>("/api/user", {
        params: {
          pageSize: 1000,
          role: ROLE.CUSTOMER,
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

  const fetchOrderInvoiceData = async (page: number) =>
    await httpClient
      .get<OrderInvoiceResponse>("/api/invoice/order", {
        params: {
          page: page - 1,
          pageSize: 7,
          userId: customerFilter,
          paymentMethod: paymentFilter,
          invoiceNumber: invoiceNumberFilter,
          shippingCost: costFilter,
          orderId: orderFilter,
          paymentDate:
            dateFilter === ""
              ? null
              : timezonedDayjs(dateFilter).format("DD-MM-YYYY"),
        },
      })
      .then((res: AxiosResponse<OrderInvoiceResponse>) => {
        // console.log("Result: " + JSON.stringify(res.data));
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
            Bạn có muốn xuất dữ liệu danh sách hoá đơn không?
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
              onClick={() => exportData()}
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
      <Modal
        open={openUpload}
        onClose={handleCloseUpload}
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
            Bạn có muốn nhập dữ liệu danh sách hoá đơn không?
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
              onClick={() => importData()}
            >
              Có
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ ml: 1 }}
              onClick={() => handleCloseUpload()}
            >
              Không
            </Button>
          </Box>
        </Box>
      </Modal>
      <div className="flex items-center justify-between">
        {/* <h4 className="mb-6 text-xl font-semibold text-black dark:text-white ">
              Danh sách xe container
            </h4> */}
        <form>
          <div className="relative border-0">
            <p className="text-black font-semibold text-xl">
              Danh sách hoá đơn vận chuyển
            </p>
          </div>
        </form>
        <div className="gap-3 flex">
          <Link
            to="new"
            className="inline-flex items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 xl:px-3"
          >
            + Tạo mới
          </Link>

          <div
            onClick={handleOpen}
            className="inline-flex hover:cursor-pointer items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 xl:px-3"
          >
            Xuất Excel
          </div>
          <div>
            <label
              htmlFor="uploadFile1"
              className="inline-flex items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 xl:px-3"
            >
              Nhập Excel
              <input
                onChange={handleFileChange}
                accept="image/jpeg,image/gif,image/png,image/x-eps,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                type="file"
                id="uploadFile1"
                className="hidden"
              />
            </label>
          </div>
          <div
            onClick={downloadSample}
            className="inline-flex hover:cursor-pointer items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-3 xl:px-3"
          >
            Tải mẫu
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 mt-2">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto  text-black">
            <table className="w-full table-auto ">
              <thead className="bg-secondary hover:cursor-default">
                <tr className="text-center dark:bg-meta-4 ">
                  <th className="min-w-[80px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11">
                    Mã hoá đơn
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11">
                    Khách hàng
                  </th>
                  <th className="min-w-[100px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11">
                    Mã khách hàng
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-bold text-black dark:text-white xl:pl-11">
                    Mã đơn hàng
                  </th>
                  <th className="min-w-[6px] py-4 px-4 font-bold text-black dark:text-white">
                    Chi Phí (VNĐ)
                  </th>
                  <th className="min-w-[60px] py-4 px-4 font-bold text-black dark:text-white">
                    Ngày thanh toán
                  </th>
                  <th className="min-w-[60px] py-4 px-4 font-bold text-center text-black dark:text-white">
                    Thanh toán
                  </th>
                  <th className="py-4 px-4 font-bold text-black dark:text-white"></th>
                </tr>
                {/* Search */}
                <tr className="text-center items-center dark:bg-meta-4 ">
                  <th className="px-3 pb-2 max-w-[130px]">
                    <input
                      type="text"
                      name="lisenceFilter"
                      className="w-full bg-white focus:outline-none border-0 rounded-md font-normal"
                      value={invoiceNumberFilter}
                      onChange={(e) => {
                        setInvoiceNumberFilter(e.target.value);
                        setPage(1);
                      }}
                    />
                  </th>
                  <th className="px-3 pb-2 font-normal max-w-[200px] ">
                    <select
                      value={customerFilter}
                      onChange={(e) => {
                        setCustomerFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 pb-2 w-full rounded-lg border-0 outline-none "
                    >
                      <option className="border-0 outline-none" value="">
                        None
                      </option>
                      {customers &&
                        customers.length > 0 &&
                        customers.map((customer, index) => (
                          <option
                            key={index}
                            className="border-0 outline-none w-full"
                            value={customer.userId}
                          >
                            {customer?.firstName + " " + customer?.lastName}
                          </option>
                        ))}
                    </select>
                  </th>
                  <th className="px-3 pb-2 font-normal max-w-[100px] ">
                    <select
                      value={customerNumberFilter}
                      onChange={(e) => {
                        setCustomerNumberFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 pb-2 w-full rounded-lg border-0 outline-none "
                    >
                      <option className="border-0 outline-none" value="">
                        None
                      </option>
                      {customers &&
                        customers.length > 0 &&
                        customers.map((customer, index) => (
                          <option
                            key={index}
                            className="border-0 outline-none w-full"
                            value={customer.userNumber}
                          >
                            {customer?.userNumber}
                          </option>
                        ))}
                    </select>
                  </th>
                  <th className="px-3 pb-2 font-normal max-w-[100px] ">
                    <select
                      value={orderFilter}
                      onChange={(e) => {
                        setOrderFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 pb-2 w-full rounded-lg border-0 outline-none "
                    >
                      <option className="border-0 outline-none" value="">
                        None
                      </option>
                      {orders &&
                        orders.length > 0 &&
                        orders.map((order, index) => (
                          <option
                            key={index}
                            className="border-0 outline-none"
                            value={order.orderId}
                          >
                            {order.orderNumber}
                          </option>
                        ))}
                    </select>
                  </th>
                  <th className="px-3 pb-2 font-normal max-w-[100px]">
                    <input
                      type="number"
                      name="providerFilter"
                      className="w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                      value={costFilter}
                      onChange={handleNumberChange}
                      onKeyDown={(e) =>
                        exceptThisSymbols.includes(e.key) && e.preventDefault()
                      }
                    />
                  </th>
                  <th className="px-3 pb-2 font-normal max-w-[100px]">
                    <input
                      required
                      name="registrationDate"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value);
                        setPage(1);
                      }}
                      className="custom-input-date custom-input-date-1 w-full bg-white focus:outline-none border-0 font-normal rounded-md"
                    />
                  </th>
                  <th className="px-3 pb-2 font-normal">
                    <select
                      value={paymentFilter}
                      onChange={(e) => {
                        setPaymentFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-3 pb-2 w-full rounded-lg border-0 outline-none"
                    >
                      <option className="border-0 outline-none" value="">
                        None
                      </option>
                      <option
                        className="border-0 outline-none"
                        value={PAYMENT_METHOD.BANKING}
                      >
                        Banking
                      </option>
                      <option
                        className="border-0 outline-none"
                        value={PAYMENT_METHOD.CAST}
                      >
                        Tiền mặt
                      </option>
                    </select>
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
                {data && data.orderInvoices?.length > 0 ? (
                  data.orderInvoices.map((invoice, index) => (
                    <tr className="hover:bg-stroke text-center" key={index}>
                      <td
                        // onClick={() => {
                        //   navigate("/truck/");
                        // }}
                        className="border-b border-[#eee] hover:cursor-pointer  py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                      >
                        <h5 className="font-medium hover:text-primary text-black dark:text-white">
                          {invoice.invoiceNumber}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 text-black dark:border-strokedark">
                        {invoice.customer?.firstName +
                          " " +
                          invoice.customer?.lastName}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 text-black dark:border-strokedark">
                        {invoice.customer?.userNumber}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 text-black dark:border-strokedark">
                        {invoice.order?.orderNumber &&
                          invoice.order?.orderNumber}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {invoice.shippingCost
                            ? invoice.shippingCost.toLocaleString()
                            : 0}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {invoice.paymentDate &&
                            dayjs(invoice.paymentDate).format("DD-MM-YYYY")}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {invoice.paymentMethod ? invoice.paymentMethod : ""}
                        </p>
                      </td>
                      {/* Action */}
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            onClick={() =>
                              navigate(
                                "/invoice/order/" + invoice.orderInvoiceId
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
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 whitespace-nowrap text-center items-center justify-center"
                    >
                      {isFetching ? "" : "Không có kết quả!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <br />
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
    </>
  );
}

export default OrderInvoice;
