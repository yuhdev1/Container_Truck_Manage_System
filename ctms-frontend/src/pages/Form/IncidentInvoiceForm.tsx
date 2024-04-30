import Breadcrumb from "../../components/Breadcrumb";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { _User } from "../../model/truck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PAYMENT_METHOD, QUERY_KEY, ROLE } from "../../libs/constant";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  IncidentInvoiceResponse,
  IncidentInvoicesRequest,
  IncidentInvoice,
  GetUserResponse,
  _Order,
  GetOrderResponse,
} from "../../model/invoice";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import UploadedFile from "../../components/UploadedFile";

const incidentInvoiceForm = {
  incidentInvoiceId: "",
  invoiceNumber: "",
  driverId: "",
  orderId: "",
  description: "",
  cost: 0,
  paymentMethod: "",
  attach: "",
  paymentDate: dayjs().format("YYYY-MM-DD"),
  tax: 0,
};

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
const IncidentInvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState(incidentInvoiceForm);
  const [drivers, setDrivers] = useState<_User[]>([]);
  const [orders, setOrders] = useState<_Order[]>([]);
  const [file, setFile] = useState<File>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayInput, setDisplayInput] = useState(true);
  const [filename, setFilename] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);
  const httpClient = useAxiosAuth();
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const acceptThisExtensions = ["png", "jpg", "xls", "xlsx", "docx", "doc"];

  const fetchInvoiceData = (invoiceId: string) =>
    httpClient
      .get<IncidentInvoiceResponse>("/api/invoice/incident", {
        params: {
          incidentInvoiceId: invoiceId,
        },
      })
      .then((res: AxiosResponse<IncidentInvoiceResponse>) => {
        if (res.data.incidentInvoices.length > 0) {
          const data = res.data.incidentInvoices[0];
          setInvoiceData({
            incidentInvoiceId: invoiceId,
            driverId: data.driver ? data.driver.userId : "",
            orderId: data.order ? data.order.orderId : "",
            description: data.description,
            paymentMethod: data.paymentMethod,
            attach: "",
            invoiceNumber: data.invoiceNumber,
            paymentDate: dayjs(data.paymentDate).format("YYYY-MM-DD"),
            cost: data.cost,
            tax: data.tax,
          });
          if (data.attach.length > 0) {
            setDisplayInput(false);
            setFilename(data.attach);
            setIsUploaded(true);
          }
        }
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

  const { error, refetch } = useQuery({
    queryKey: [QUERY_KEY.INCIDENT_INVOICE_BY_ID, invoiceId],
    queryFn: () => fetchInvoiceData(invoiceId !== undefined ? invoiceId : ""),
  });
  const fetchDriverData = () =>
    httpClient
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
  useEffect(() => {
    const drivers = fetchDriverData();
    drivers.then((driver) => {
      driver && setDrivers(driver.content);
    });
    const orders = fetchOrderData();
    orders.then((order) => {
      order && setOrders(order.content);
    });
  }, []);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value.slice(0, 100),
    });
  };
  const handleNumberChange = (e: SelectChangeEvent<number>) => {
    const value = Math.max(0, Math.min(999999999999, Number(e.target.value)));
    setInvoiceData({
      ...invoiceData,
      cost: value,
    });
  };
  const handleFileChange = (e: SelectChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const fl = files[0];
      const extension = fl.name.toLowerCase().split(".").pop();
      if (extension && !acceptThisExtensions.includes(extension)) {
        toast.error("Chỉ chấp nhận file png, jpg và xlsx");
        e.target.value = "";
        return;
      }
      if (fl.size / 1024 > 3000) {
        alert("Kích thước file phải nhỏ hơn 3MB");
        e.target.value = "";
        return;
      }
      setFile(fl);
      //getBase64(fl).then((data) => setFile(data ? data.toString() : ""));
      setDisplayInput(false);
      setFilename(fl.name);
      console.log("Base64: " + file);
    }
  };

  async function downloadFile() {
    await httpClient
      .get("api/blob/download", {
        params: {
          filename:
            "invoice/incident/" + invoiceData.invoiceNumber + "/" + filename,
        },
        responseType: "blob",
      })
      .then((res) => {
        console.log(res.data);
        const file = new Blob([res.data]);

        let url = window.URL.createObjectURL(file);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
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
  }
  function handleRemoveUpload() {
    setFile(undefined);
    setFilename("");
    setOpen(false);
    setDisplayInput(true);
    setIsUploaded(false);
  }
  const addInvoice = async (request: FormData) =>
    await httpClient
      .post("api/invoice/incident/add", request)
      .then((res: AxiosResponse<IncidentInvoiceResponse>) => {
        toast.success("Tạo mới hoá đơn thành công");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.INCIDENT_INVOICE],
        });
        navigate("/invoice/incident");
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 499) {
          toast.error("Mã hoá đơn đã tồn tại!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        console.log(reason.message);
      });

  const editInvoice = async (request: FormData) =>
    await httpClient
      .post("api/invoice/incident/edit", request)
      .then((res: AxiosResponse<IncidentInvoice>) => {
        toast.success("Lưu thành công!");
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.INCIDENT_INVOICE],
        });
        refetch.call(
          fetchInvoiceData(invoiceId !== undefined ? invoiceId : "")
        );
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 499) {
          toast.error("Mã hoá đơn đã tồn tại!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        console.log(reason.message);
      });

  const createMutation = useMutation({
    mutationFn: (req: FormData) => addInvoice(req),
  });

  const editMutation = useMutation({
    mutationFn: (req: FormData) => editInvoice(req),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gửi yêu cầu POST đến API backend để tạo mới người dùng
    const request: IncidentInvoicesRequest = {
      incidentInvoiceDTO: {
        incidentInvoiceId: invoiceId,
        paymentDate: dayjs(invoiceData.paymentDate).format("DD-MM-YYYY"),
        description: invoiceData.description,
        paymentMethod: invoiceData.paymentMethod,
        attach: filename,
        cost: invoiceData.cost,
        invoiceNumber: invoiceData.invoiceNumber,
        tax: invoiceData.tax,
      },
      driverId: invoiceData.driverId,
      orderId: invoiceData.orderId,
    };
    //creat form data
    const formData = new FormData();
    formData.append(
      "incidentInvoiceRequest",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    file && formData.append("file", file);

    if (invoiceId !== undefined) {
      editMutation.mutate(formData);
    } else createMutation.mutate(formData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <>
      <Breadcrumb
        pageName={
          invoiceId !== undefined ? "Thông tin hoá đơn" : "Tạo mới hoá đơn"
        }
      />

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
            Bạn có chắc muốn xoá file đã upload không?
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
              onClick={handleRemoveUpload}
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

      <div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {/* <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Mẫu tạo mới xe container
              </h3>
            </div> */}
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mã hoá đơn
                    </label>
                    <input
                      required
                      name="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={handleChange}
                      placeholder="Nhập mã hoá đơn"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Chi phí (VNĐ)
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="cost"
                        type="number"
                        value={invoiceData.cost}
                        min={0}
                        max={9999999999}
                        onKeyDown={(e) =>
                          exceptThisSymbols.includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={handleNumberChange}
                        className="custom-input-date custom-input-date-1 w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="w-full xl:w-1/3"></div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Phương thức thanh toán
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Thanh toán
                      </InputLabel>
                      <Select
                        name="paymentMethod"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={invoiceData.paymentMethod}
                        label="Thanh toán"
                        onChange={handleChange}
                      >
                        <MenuItem selected value={PAYMENT_METHOD.BANKING}>
                          Banking
                        </MenuItem>
                        <MenuItem value={PAYMENT_METHOD.CAST}>
                          Tiền mặt
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tài xế
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 160 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Tài xế
                      </InputLabel>
                      <Select
                        defaultValue=""
                        name="driverId"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={
                          invoiceData.driverId === undefined ||
                          invoiceData.driverId === null ||
                          invoiceData.driverId.length === 0 ||
                          drivers === undefined ||
                          drivers?.length === 0
                            ? ""
                            : invoiceData.driverId
                        }
                        label="Trạng thái"
                        onChange={handleChange}
                      >
                        {drivers &&
                          drivers.length > 0 &&
                          drivers.map((driver, index) => (
                            <MenuItem
                              key={index}
                              selected
                              value={driver.userId}
                            >
                              {driver.firstName! +
                                " " +
                                driver.lastName! +
                                " - " +
                                driver.userNumber}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mã đơn hàng
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Đơn hàng
                      </InputLabel>
                      <Select
                        defaultValue=""
                        name="orderId"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={
                          invoiceData.orderId === undefined ||
                          invoiceData.orderId === null ||
                          invoiceData.orderId === "" ||
                          orders === undefined ||
                          orders?.length === 0
                            ? ""
                            : invoiceData.orderId
                        }
                        label="Trạng thái"
                        onChange={handleChange}
                      >
                        {orders &&
                          orders.length > 0 &&
                          orders.map((order, index) => (
                            <MenuItem
                              key={index}
                              selected
                              value={order.orderId}
                            >
                              {order.orderNumber}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày thanh toán
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="paymentDate"
                        type="date"
                        value={invoiceData.paymentDate}
                        onChange={handleChange}
                        className="custom-input-date custom-input-date-1 w-2/3 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Thuế(%)
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small-label">Thuế</InputLabel>
                      <Select
                        name="tax"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={invoiceData.tax?.toString()}
                        label="Trạng thái"
                        onChange={handleChange}
                      >
                        <MenuItem selected value="0">
                          0
                        </MenuItem>
                        <MenuItem selected value="2">
                          2
                        </MenuItem>
                        <MenuItem selected value="5">
                          5
                        </MenuItem>
                        <MenuItem selected value="8">
                          8
                        </MenuItem>
                        <MenuItem selected value="10">
                          10
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2"></div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tệp đính kèm
                    </label>
                    {displayInput && (
                      <input
                        type="file"
                        accept="image/jpeg,image/gif,image/png,image/x-eps,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        placeholder="Upload file"
                        onChange={handleFileChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                      />
                    )}

                    <UploadedFile
                      display={!displayInput}
                      filename={filename}
                      displayUpload={isUploaded}
                      handleRemoveUpload={handleOpen}
                      handleDownload={downloadFile}
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      name="description"
                      value={invoiceData.description}
                      onChange={(e) => {
                        setInvoiceData({
                          ...invoiceData,
                          description: e.target.value,
                        });
                      }}
                      rows={6}
                      placeholder="Mô tả"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {invoiceId !== undefined ? "Lưu" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncidentInvoiceForm;
