import {
  Autocomplete,
  AutocompleteValue,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  TextField,
} from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { FormEvent, useState, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { SelectChangeEvent } from "@mui/material";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { user } from "../../model/user";
import dayjs from "dayjs";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import toast from "react-hot-toast";
import UploadedFile from "../../components/UploadedFile";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import LocationInput from "../../components/LocationInput";
import { LocationSuggestResponse } from "../../model/dashboard";
import { Value } from "react-calendar/dist/cjs/shared/types";
import { MultiplicativeOperator } from "typescript";
const AddTransportationContract = () => {
  const navigate = useNavigate();
  const axios = useAxiosAuth();
  const [customers, setCustomers] = useState<user[]>([]);
  const [file, setFile] = useState<File>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [displayInput, setDisplayInput] = useState(true);
  const [filename, setFilename] = useState("");
  const acceptThisExtensions = ["png", "jpg", "xls", "xlsx", "docx", "doc"];
  const [options, setOptions] = useState<{ id?: string; label: string }[]>([]);

  useEffect(() => {
    // Gọi API để lấy danh sách khách hàng và tài xế
    const fetchCustomersAndDrivers = async () => {
      try {
        const customersResponse = await axios.get(
          "http://localhost:8099/api/user?role=CUSTOMER"
        );
        setCustomers(customersResponse.data.content);
      } catch (error) {
        console.error("Error fetching customers and drivers:", error);
      }
    };

    fetchCustomersAndDrivers();
  }, []);

  async function downloadFile() {
    await axios
      .get("api/blob/download", {
        params: {
          filename:
            "contract/transportation/" +
            formData.contractNumber +
            "/" +
            filename,
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
  const [formData, setFormData] = useState({
    customerId: "",
    contractNumber: "",
    deposit: "",
    etd: "",
    eta: "",
    requestedDeliveryDate: "",
    shippingAddress: "",
    deliveryAddress: "",
    attach: "",
    totalPrice: "",
  });
  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    axios
      .get("http://api.map4d.vn/sdk/autosuggest", {
        params: {
          key: "a05f1551557fd15b7dc77c9d6f7094f8",
          text: e.target.value,
        },
      })
      .then((res: AxiosResponse<LocationSuggestResponse>) => {
        if (res && res.data.result) {
          const locations = res.data.result;
          locations.forEach((x) =>
            options.unshift({ id: x.id, label: x.address })
          );
        }
      });
    if (e.target.value === "") {
      options.splice(0, options.length);
    }
  };

  console.log(formData.etd);
  const handleDriverChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (parseInt(formData.deposit) >= parseInt(formData.totalPrice)) {
      toast.error("Tiền cọc không thể lớn hơn hoặc bằng tiền đơn hàng")
    } else {
      if (formData.eta < formData.etd) {
        toast.error("Ngày giao hàng dự kiến không thể lớn hơn ngày nhận hàng dự kiến!");
      } else {
        const formattedData = {
          ...formData,
          attach: filename,
          etd: dayjs(formData.etd, "YYYY-MM-DD").format("DD-MM-YYYY"),
          eta: dayjs(formData.eta, "YYYY-MM-DD").format("DD-MM-YYYY"),
          requestedDeliveryDate: dayjs(
            formData.requestedDeliveryDate,
            "YYYY-MM-DD"
          ).format("DD-MM-YYYY"),
          // Thêm các trường khác nếu cần
        };
        // const TransportationContractDTO = formData;

        const formDataSend = new FormData();
        formDataSend.append(
          "transportationContract",
          new Blob([JSON.stringify(formattedData)], { type: "application/json" })
        );
        file && formDataSend.append("file", file);
        // Gửi yêu cầu POST đến API backend để tạo mới người dùng
        console.log("câccacaca", formDataSend);
        axios
          .post("http://localhost:8099/api/contract/transportation", formDataSend)
          .then((response) => {
            console.log("User created successfully:", response.data);
            // Xử lý sau khi tạo thành công, ví dụ: hiển thị thông báo
            navigate("/contract/transport");
            toast.success("Tạo hợp đồng thành công!");
          })
          .catch((error) => {
            console.error("Error creating user:", error);
            console.log("form data", formData);
            // Xử lý sau khi gặp lỗi, ví dụ: hiển thị thông báo lỗi
            toast.error("Tạo hợp đồng thất bại!");
          });
      }
    }

  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  function handleRemoveUpload() {
    setFile(undefined);
    setFilename("");
    setOpen(false);
    setDisplayInput(true);
    setIsUploaded(false);
  }
  return (
    <>
      <Breadcrumb pageName="Thêm mới hợp đồng" />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn xoá file đã upload không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleRemoveUpload} autoFocus>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 dark:border-strokedark">
              {/* <h3 className="font-medium text-black dark:text-white">
                Thông tin hợp đồng
              </h3> */}
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Khách hàng
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 360 }} size="small">
                      <InputLabel id="label_delect_customer">
                        Khách hàng
                      </InputLabel>
                      <Select
                        name="customerId"
                        labelId="label_delect_customer"
                        required
                        id="select_customer"
                        label="customerId"
                        onChange={handleDriverChange}
                      >
                        {customers &&
                          customers.map((customer) => (
                            <MenuItem
                              value={customer.userId}
                              key={customer.userId}
                            >
                              {customer.firstName} {customer.lastName} -{" "}
                              {customer.userNumber}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2"></div>
                  <div className="w-full xl:w-1/2"></div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mã số hợp đồng
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={30}
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tiền cọc (VND)
                    </label>
                    <input
                      type="number"
                      name="deposit"
                      required
                      title="Vui lòng chỉ nhập số "
                      maxLength={30}
                      value={formData.deposit}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tiền đơn hàng (VND)
                    </label>
                    <input
                      type="number"
                      required
                      name="totalPrice"
                      value={formData.totalPrice}
                      title="Vui lòng chỉ nhập số "
                      maxLength={30}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Địa chỉ giao hàng
                    </label>
                    <Autocomplete
                      disablePortal
                      clearOnBlur={false}
                      id="combo-box-demo"
                      size="small"
                      noOptionsText="Không có kết quả!"
                      options={options}
                      onChange={(e, v) => {
                        v?.label &&
                          setFormData({
                            ...formData,
                            shippingAddress: v?.label,
                          });
                      }}
                      className="w-full"
                      renderOption={(props, option, index) => {
                        const key = `listItem-${index.index}-${option.id}`;
                        return (
                          <li {...props} key={key}>
                            {option.label}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="shippingAddress"
                          className="outline-none border-0"
                          value={formData.shippingAddress}
                          onChange={handleAddressChange}
                          required
                          label="Địa điểm"
                        />
                      )}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Địa chỉ nhận hàng
                    </label>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      clearOnBlur={false}
                      size="small"
                      noOptionsText="Không có kết quả!"
                      options={options}
                      onChange={(e, v) => {
                        v?.label &&
                          setFormData({
                            ...formData,
                            deliveryAddress: v?.label,
                          });
                      }}
                      className="w-full"
                      renderOption={(props, option, index) => {
                        const key = `listLocation-${index.index}-${option.id}`;
                        return (
                          <li {...props} key={key}>
                            {option.label}
                          </li>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="deliveryAddress"
                          className="outline-none border-0"
                          // value={formData.deliveryAddress}
                          required
                          onChange={handleAddressChange}
                          label="Địa điểm"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày giao hàng dự kiến
                    </label>
                    <input
                      type="date"
                      name="etd"
                      value={formData.etd}
                      required
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày nhận hàng dự kiến
                    </label>
                    <input
                      type="date"
                      name="eta"
                      value={formData.eta}
                      required
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày yêu cầu nhận hàng
                    </label>
                    <input
                      type="date"
                      name="requestedDeliveryDate"
                      required
                      value={formData.requestedDeliveryDate}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      File hợp đồng
                    </label>
                    {displayInput && (
                      <input
                        type="file"
                        accept="image/jpeg,image/gif,image/png,image/x-eps,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTransportationContract;
