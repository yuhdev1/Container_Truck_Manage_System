import Breadcrumb from "../../components/Breadcrumb";
import { useState } from "react";
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
import { ContainerTruck, ContainerTruckResponse } from "../../model/truck";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CONTAINER_STATUS, QUERY_KEY } from "../../libs/constant";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import UploadedFile from "../../components/UploadedFile";

const containerFormData = {
  truckId: "",
  licensePlate: "",
  manufacturer: "",
  capacity: 0,
  isActive: "",
  containerStatus: "",
  registrationDate: dayjs().format("YYYY-MM-DD"),
  driver: {
    firstName: "",
    lastName: "",
  },
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
const ContainerTruckForm = () => {
  const [formData, setFormData] = useState(containerFormData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [displayInput, setDisplayInput] = useState(true);
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const { truckId } = useParams();
  const httpClient = useAxiosAuth();
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const acceptThisExtensions = ["png", "jpg", "xls", "xlsx", "docx", "doc"];

  dayjs.extend(customParseFormat);
  const fetchTruckData = (truckId: string) =>
    httpClient
      .get<ContainerTruckResponse>("/api/containertruck", {
        params: {
          truck_id: truckId,
        },
      })
      .then((res: AxiosResponse<ContainerTruckResponse>) => {
        // console.log("Result: " + JSON.stringify(res.data));

        if (res.data.containerTrucks.length > 0) {
          const data = res.data.containerTrucks[0];
          console.log(
            "fetch: " + dayjs(data.registrationDate).format("YYYY-MM-DD")
          );
          setFormData({
            truckId: data.truckId ? data.truckId : "",
            licensePlate: data.licensePlate,
            manufacturer: data.manufacturer,
            capacity: data.capacity,
            registrationDate: dayjs(data.registrationDate).format("YYYY-MM-DD"),
            isActive: data.isActive ? "1" : "0",
            containerStatus: data.containerStatus,
            driver: {
              firstName: data.driver?.firstName ? data.driver.firstName : "",
              lastName: data.driver?.lastName ? data.driver.lastName : "",
            },
          });
          if (data.attach && data.attach.length > 0) {
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

  const { refetch } = useQuery({
    queryKey: [QUERY_KEY.CONTAINER_TRUCK_BY_ID, truckId],
    queryFn: () => fetchTruckData(truckId !== undefined ? truckId : ""),
  });

  const handleNumberChange = (e: SelectChangeEvent<number>) => {
    const value = Math.max(0, Math.min(9999999999, Number(e.target.value)));
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };
  const handleChange = (e: SelectChangeEvent<string>, limit?: number) => {
    setFormData({
      ...formData,
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
        toast.error("Chỉ chấp nhận file png, jpg, docx và xlsx");
        e.target.value = "";
        return;
      }
      if (fl.size / 1024 > 3000) {
        alert("Kích thước file phải nhỏ hơn 3MB");
        e.target.value = "";
        return;
      }
      setFile(fl);
      setDisplayInput(false);
      setFilename(fl.name);
    }
  };

  async function downloadFile() {
    await httpClient
      .get("api/blob/download", {
        params: {
          filename: "container/" + formData.licensePlate + "/" + filename,
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
  console.log(truckId);
  const addContainer = async (request: ContainerTruck) => {
    const formData = new FormData();
    formData.append(
      "addContainerTruckRequest",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    file && formData.append("file", file);

    await httpClient
      .post("api/containertruck/add", formData)
      .then((res: AxiosResponse<ContainerTruck>) => {
        queryClient.setQueryData([QUERY_KEY.CONTAINER_TRUCK], res.data);
        toast.success("Thêm xe thành công!");
        navigate("/truck");
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 499) {
          toast.error("Biển số xe đã tồn tại!");
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
  };

  const editContainer = async (request: ContainerTruck) => {
    const formData = new FormData();
    formData.append(
      "editContainerRequest",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    file && formData.append("file", file);
    await httpClient
      .post("api/containertruck/edit", formData)
      .then((res: AxiosResponse<ContainerTruck>) => {
        queryClient.setQueryData([QUERY_KEY.CONTAINER_TRUCK], res.data);
        toast.success("Lưu thông tin thành công!");
        refetch.call(fetchTruckData(truckId !== undefined ? truckId : ""));
        return res.data;
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 499) {
          toast.error("Biển số xe đã tồn tại!");
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
  };

  const createMutation = useMutation({
    mutationFn: (req: ContainerTruck) => addContainer(req),
  });

  const editMutation = useMutation({
    mutationFn: (req: ContainerTruck) => editContainer(req),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const truckRequest: ContainerTruck = {
      truckId: truckId,
      licensePlate: formData.licensePlate,
      manufacturer: formData.manufacturer,
      capacity: Number(formData.capacity),
      registrationDate: dayjs(formData.registrationDate).format("DD-MM-YYYY"),
      isActive: formData.isActive === "1" ? true : false,
      attach: filename,
      containerStatus: formData.containerStatus,
    };
    if (truckId !== undefined) {
      editMutation.mutate(truckRequest);
    } else createMutation.mutate(truckRequest);
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
        pageName={truckId !== undefined ? "Thông tin xe" : "Tạo mới xe"}
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
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Biển số xe
                    </label>
                    <input
                      required
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => handleChange(e, 20)}
                      placeholder="Nhập biển số xe"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nhà cung cấp
                    </label>
                    <input
                      required
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      placeholder="Nhập nhà cung cấp"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tải trọng (KG)
                    </label>
                    <input
                      required
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleNumberChange}
                      onKeyDown={(e) =>
                        exceptThisSymbols.includes(e.key) && e.preventDefault()
                      }
                      placeholder="Nhập tải trọng"
                      className="w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày đăng kí
                    </label>
                    <div className="relative">
                      <input
                        required
                        name="registrationDate"
                        type="date"
                        value={formData.registrationDate}
                        onChange={handleChange}
                        className="custom-input-date custom-input-date-1 w-1/2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Trạng thái
                    </label>
                    <FormControl
                      sx={{ m: 0, minWidth: 120, height: 30 }}
                      size="small"
                    >
                      <InputLabel id="demo-select-small-label">
                        Trạng thái
                      </InputLabel>
                      <Select
                        name="containerStatus"
                        labelId="demo-select-small-label"
                        required
                        id="demo-select-small"
                        value={formData.containerStatus}
                        label="Trạng thái"
                        onChange={(e) => handleChange(e)}
                      >
                        <MenuItem selected value={CONTAINER_STATUS.READY}>
                          Sẵn sàng
                        </MenuItem>
                        <MenuItem selected value={CONTAINER_STATUS.ACTIVE}>
                          Đang vận chuyển
                        </MenuItem>
                        <MenuItem value={CONTAINER_STATUS.INACTIVE}>
                          Ngưng hoạt động
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
                <button
                  type="submit"
                  className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {truckId !== undefined ? "Lưu" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContainerTruckForm;
