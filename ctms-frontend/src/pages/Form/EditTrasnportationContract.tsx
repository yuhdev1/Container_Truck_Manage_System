import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select } from "@mui/material";
import axios, { AxiosError } from "axios";
import Breadcrumb from "../../components/Breadcrumb";
import { FormEvent, useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { user } from "../../model/user";
import { useParams } from "react-router-dom";
import { ContainerTruck } from "../../model/container_truck";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import dayjs from "dayjs";
import UploadedFile from "../../components/UploadedFile";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
const EditTransportationContract = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  const axios = useAxiosAuth();
  const [displayInput, setDisplayInput] = useState(true);
  const { customerContractId } = useParams();
  const [filename, setFilename] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const acceptThisExtensions = ["png", "jpg", "xls", "xlsx"];
  const [formData, setFormData] = useState({
    contractNumber: "",
    etd: "",
    eta: "",
    requestedDeliveryDate: "",
    deliveryAddress: "",
    shippingAddress: "",
    note: "",
    attach: "",
    deposit: "",
    totalPrice: ""
  });
  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết của người dùng dựa trên userId
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8099/api/contract/transportation?contractId=${customerContractId}`
        );
        const user = response.data.content[0];
        // const formattedEta = dayjs(user.eta, 'DD-MM-YYYY').format('YYYY-MM-DD');
        // const formattedEtd = dayjs(user.etd, 'DD-MM-YYYY').format('YYYY-MM-DD');
        // const formattedrequestedDeliveryDate = dayjs(user.requestedDeliveryDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
        // setFormData({
        //     ...user,
        //     eta: formattedEta,
        //     etd: formattedEtd,
        //     requestedDeliveryDate: formattedrequestedDeliveryDate
        // });
        setFormData(user)
        if (user.attach.length > 0) {
          setDisplayInput(false);
          setFilename(user.attach);
          setIsUploaded(true);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [customerContractId]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    const formDataSend = new FormData();
    formDataSend.append(
      "transportationContract",
      new Blob([JSON.stringify(formattedData)], { type: "application/json" })
    );
    file && formDataSend.append("file", file);
    // Gửi yêu cầu POST đến API backend để tạo mới người dùng
    console.log('câccacaca', formDataSend)
    // Gửi yêu cầu POST đến API backend để tạo mới người dùng
    axios
      .put(`http://localhost:8099/api/contract/transportation/${customerContractId}`, formDataSend)
      .then((response) => {
        console.log("User created successfully:", response.data);
        // Xử lý sau khi tạo thành công, ví dụ: hiển thị thông báo
        navigate("/contract/transport")
        toast.success('Cập nhật hợp đồng thành công!')
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        console.log("form data", formData);
        // Xử lý sau khi gặp lỗi, ví dụ: hiển thị thông báo lỗi
        alert("Error creating user. Please try again.");
      });
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



      <div>
        <Breadcrumb pageName="Thông tin hợp đồng" />
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
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Thông tin cụ thể
              </h3>
            </div>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Mã hợp đồng
                    </label>
                    <input
                      type="text"
                      name="contractNumber"
                      value={formData.contractNumber}
                      onChange={handleChange}
                      maxLength={30}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày giao hàng dự kiến
                    </label>
                    <input
                      type="date"
                      name="etd"
                      value={formData.etd}
                      onChange={handleChange}
                      required
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
                      onChange={handleChange}

                      required
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
                      value={formData.requestedDeliveryDate}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Địa chỉ giao hàng
                    </label>
                    <input
                      readOnly
                      type="text"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      maxLength={200}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Địa chỉ nhận hàng
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      maxLength={200}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tiền cọc
                    </label>
                    <input
                      type="text"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleChange}
                      maxLength={30}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tiền đơn hàng
                    </label>
                    <input
                      type="text"
                      name="totalPrice"
                      value={formData.totalPrice}
                      onChange={handleChange}
                      maxLength={30}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      File Hợp đồng
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
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>




    </>
  );
};

export default EditTransportationContract;
