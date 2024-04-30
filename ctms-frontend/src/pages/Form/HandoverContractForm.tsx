import Breadcrumb from "../../components/Breadcrumb";
import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  ContainerTruck,
  ContainerTruckResponse,
  _User,
} from "../../model/truck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEY, ROLE } from "../../libs/constant";
import { useNavigate, useParams } from "react-router-dom";
import { GetUserResponse } from "../../model/invoice";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import UploadedFile from "../../components/UploadedFile";
import {
  HandoverContractRequest,
  HandoverContractResponse,
} from "../../model/contract";
import timezonedDayjs from "../../libs/dayjstz";

const repairInvoiceForm = {
  contractNumber: "",
  handingContractId: "",
  truckId: "",
  userId: "",
  startDate: timezonedDayjs().format("YYYY-MM-DD"),
  endDate: timezonedDayjs().format("YYYY-MM-DD"),
  salary: 0,
  note: "",
  attach: "",
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
const HandoverContractForm = () => {
  const [drivers, setDrivers] = useState<_User[]>([]);
  const [invoiceData, setInvoiceData] = useState(repairInvoiceForm);
  const [file, setFile] = useState<File>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayInput, setDisplayInput] = useState(true);
  const [filename, setFilename] = useState("");
  const [trucks, setTrucks] = useState<ContainerTruck[]>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { contractId } = useParams();
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const acceptThisExtensions = ["png", "jpg", "xls", "xlsx", "docx", "doc"];

  const httpClient = useAxiosAuth();

  const fetchContractData = async (contractId: string) =>
    await httpClient
      .get<HandoverContractResponse>("/api/contract/vehicalhandover", {
        params: {
          handingContractId: contractId,
        },
      })
      .then((res: AxiosResponse<HandoverContractResponse>) => {
        if (res.data.vehicalHandoverContracts.length > 0) {
          const data = res.data.vehicalHandoverContracts[0];
          setInvoiceData({
            handingContractId: contractId,
            contractNumber: data.contractNumber,
            truckId: data.truck?.truckId!,
            userId: data.driver?.userId!,
            note: data.note,
            salary: data.salary,
            attach: data.attach,
            startDate: timezonedDayjs(data.startDate).format("YYYY-MM-DD"),
            endDate: timezonedDayjs(data.endDate).format("YYYY-MM-DD"),
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
    queryKey: [QUERY_KEY.HANDOVER_CONTRACT_BY_ID, contractId],
    queryFn: () =>
      fetchContractData(contractId !== undefined ? contractId : ""),
  });

  const fetchTruckData = async () =>
    await httpClient
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

  const handleInput = (e: SelectChangeEvent<string>, limit?: number) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value.slice(0, limit ? limit : 100),
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
            "contract/handover/" + invoiceData.contractNumber + "/" + filename,
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

  const handleChange = (e: SelectChangeEvent<string>) => {
    setInvoiceData({
      ...invoiceData,
      [e.target.name]: e.target.value.slice(0, 49),
    });
  };

  const addContract = async (request: FormData) => {
    await httpClient
      .post("api/contract/vehicalhandover/add", request)
      .then((res: AxiosResponse<HandoverContractResponse>) => {
        toast.success("Thêm hợp đồng thành công!");
        navigate("/contract/handover");
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 499) {
          toast.error("Mã hợp đồng đã tồn tại!");
          return;
        }
        if (reason.response!.status === 498) {
          toast.error("Ngày nhập không hợp lệ!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
        return reason.response!.status;
      });
  };

  const editInvoice = async (request: FormData) => {
    await httpClient
      .post("api/contract/vehicalhandover/edit", request)
      .then((res: AxiosResponse<HandoverContractResponse>) => {
        toast.success("Sửa thông tin thành công");
        //Check user active
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.HANDOVER_CONTRACT],
        });
        refetch.call(
          fetchContractData(contractId !== undefined ? contractId : "")
        );
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 499) {
          toast.error("Mã hợp đồng đã tồn tại!");
          return;
        }
        if (reason.response!.status === 498) {
          toast.error("Ngày nhập không hợp lệ!");
          return;
        }
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
          return;
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
      });
  };

  const createMutation = useMutation({
    mutationFn: (req: FormData) => addContract(req),
  });

  const editMutation = useMutation({
    mutationFn: (req: FormData) => editInvoice(req),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timezonedDayjs(invoiceData.startDate).isAfter(invoiceData.endDate)) {
      toast.error("Ngày ký và ngày hết hạn không hợp lệ!");
      return;
    }
    // Gửi yêu cầu POST đến API backend để tạo mới
    const request: HandoverContractRequest = {
      vehicleHanoverContractDTO: {
        handingContractId: invoiceData.handingContractId,
        contractNumber: invoiceData.contractNumber,
        salary: invoiceData.salary,
        note: invoiceData.note,
        endDate: timezonedDayjs(invoiceData.endDate).format("DD-MM-YYYY"),
        startDate: timezonedDayjs(invoiceData.startDate).format("DD-MM-YYYY"),
        attach: filename,
      },
      truckId: invoiceData.truckId,
      userId: invoiceData.userId,
    };

    const formData = new FormData();
    formData.append(
      "vehicleHandoverContractRequest",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    file && formData.append("file", file);

    if (contractId !== undefined) {
      editMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
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
          contractId !== undefined ? "Thông tin hợp đồng" : "Tạo mới hợp đồng"
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
            <form
              action="#"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mã hợp đồng
                    </label>
                    <input
                      required
                      name="contractNumber"
                      value={invoiceData.contractNumber}
                      onChange={(e) => handleInput(e, 20)}
                      placeholder="Nhập mã hợp đồng"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2"></div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày kí
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="startDate"
                        type="date"
                        value={invoiceData.startDate}
                        onChange={handleChange}
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày hết hạn
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="endDate"
                        type="date"
                        value={invoiceData.endDate}
                        onChange={handleChange}
                        className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2"></div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Xe (Biển số)
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Biển số
                      </InputLabel>
                      <Select
                        defaultValue=""
                        name="truckId"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={
                          invoiceData.truckId === undefined ||
                          invoiceData.truckId === null ||
                          invoiceData.truckId.length === 0 ||
                          trucks === undefined ||
                          trucks?.length === 0
                            ? ""
                            : invoiceData.truckId
                        }
                        label="Trạng thái"
                        onChange={handleChange}
                      >
                        {trucks &&
                          trucks.length > 0 &&
                          trucks.map((truck, index) => (
                            <MenuItem
                              key={index}
                              selected
                              value={truck.truckId}
                            >
                              {truck.licensePlate}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/3">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tài xế
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Tài xế
                      </InputLabel>
                      <Select
                        defaultValue=""
                        name="userId"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={
                          invoiceData.userId === undefined ||
                          invoiceData.userId === null ||
                          invoiceData.userId.length === 0 ||
                          drivers === undefined ||
                          drivers?.length === 0
                            ? ""
                            : invoiceData.userId
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
                              {driver.firstName! + " " + driver.lastName!}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2"></div>
                </div>
                <div className="mb-4.5 gap-6 xl:flex-row text-black">
                  <div className="w-full xl:w-1/4">
                    <label className="mb-2.5 block  dark:text-white">
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
                      value={invoiceData.note}
                      onChange={(e) => {
                        setInvoiceData({
                          ...invoiceData,
                          note: e.target.value,
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
                  {contractId !== undefined ? "Lưu" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HandoverContractForm;
