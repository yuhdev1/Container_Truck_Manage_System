import { Select } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { FormEvent, useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { MFDirectionsRenderer, MFMap, MFMarker } from "react-map4d-map";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import { ChangeEvent } from "react"; // Import ChangeEvent
import Modal from "@mui/material/Modal";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
//style of modal
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "60%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const OrderDetail = () => {
  //hook
  const axios = useAxiosAuth();

  //map
  const [center, setCenter] = useState<{ lat: string; lng: string }>();
  const [showMap, setShowMap] = useState(true);
  const [routeGeometry, setRouteGeometry] = useState([]);
  const [routeGeometry1, setRouteGeometry1] = useState([]);
  const [firstLocation, setFirstLocation] = useState("");
  const [secondLocation, setSecondLocation] = useState("");
  const [thirdLocation, setThirdLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");

  //modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //oder state
  const [orderNumber, setOrderNumber] = useState("");
  const [curentStatus, setCurrentStatus] = useState("");
  const { orderId } = useParams();

  //status
  const [dataReady, setDataReady] = useState(false);
  const [activestep, setActiveStep] = useState<number>(0);
  const steps = [
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang giao hàng",
    "Đã nhận hàng",
    "Hoàn thành",
  ];
  const getStatusStep = (status: any) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRM":
        return 1;
      case "TOSHIP":
        return 2;
      case "TORECIEVE":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 0;
    }
  };
  //form data
  const [formData, setFormData] = useState({
    orderNumber: "",
    shippingDate: "",
    realityDeliveryDate: "",
    etd: "",
    eta: "",
    requestedDeliveryDate: "",
    status: "",
    deliveryAddress: "",
    shippingAddress: "",
    payment: "",
    description: "",
    price: "",
    paid: "",
  });

  //fetch point
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8099/api/tracking?orderId=${orderId}`
        );
        if (response.data.firstLocation !== null) {
          setFirstLocation(response.data.firstLocation);
        }
        if (response.data.secondLocation !== null) {
          setSecondLocation(response.data.secondLocation);
        }
        if (response.data.thirdLocation !== null) {
          setThirdLocation(response.data.thirdLocation);
        }
        if (response.data.destinationLocation !== null) {
          setDestinationLocation(response.data.destinationLocation);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [orderId]);

  //fetch map with point
  useEffect(() => {
    if (dataReady) {
      setCurrentStatus(formData.status);
      let points = "";
      let start = "";
      let end = "";

      if (secondLocation) {
        points += `${firstLocation}`;
      }
      if (thirdLocation) {
        points += `;${secondLocation}`;
      }
      if (destinationLocation) {
        points += `;${thirdLocation}`;
      }
      if (firstLocation && !secondLocation) {
        start = formData.shippingAddress;
        end = firstLocation;
      }
      if (secondLocation && !thirdLocation) {
        start = formData.shippingAddress;
        end = secondLocation;
      }
      if (thirdLocation && !destinationLocation) {
        start = formData.shippingAddress;
        end = thirdLocation;
      }
      if (destinationLocation) {
        start = formData.shippingAddress;
        end = destinationLocation;
      }

      axios
        .get("http://api.map4d.vn/sdk/route", {
          params: {
            origin: start,
            destination: end,
            vehicle: "car",
            points: points,
            key: "a05f1551557fd15b7dc77c9d6f7094f8",
          },
        })
        .then((response) => {
          const route = response.data;
          setRouteGeometry1(route);
          console.log("cccccccccccccccccc", thirdLocation);
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });
    }
  }, [dataReady]);

  //fetchOrderdetail
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8099/api/order?orderId=${orderId}`
        );

        const orderData = response.data.content[0];
        if (orderData) {
          setFormData(orderData);
          setDataReady(true);
        } else {
          console.error("No order data found for orderId:", orderId);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  //fetch map
  useEffect(() => {
    if (dataReady && formData.deliveryAddress && formData.shippingAddress) {
      setOrderNumber(formData.orderNumber);
      axios
        .get("http://api.map4d.vn/sdk/route", {
          params: {
            origin: formData.shippingAddress,
            destination: formData.deliveryAddress,
            vehicle: "car",
            key: "a05f1551557fd15b7dc77c9d6f7094f8",
          },
        })
        .then((response) => {
          const route = response.data;
          setRouteGeometry(route);
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });

      axios
        .get("https://api.map4d.vn/sdk/v2/geocode", {
          params: {
            address: formData.shippingAddress,
            key: "a05f1551557fd15b7dc77c9d6f7094f8",
          },
        })
        .then((response) => {
          if (response.data && response.data.result) {
            const location = response.data.result[0].location;
            setCenter({ lat: location.lat, lng: location.lng });
          }
        })
        .catch((error) => {
          console.error("Error fetching directions:", error);
        });
    }
  }, [dataReady, formData.deliveryAddress, formData.shippingAddress]);

  //fetch status
  useEffect(() => {
    setActiveStep(getStatusStep(formData.status));
  }, [formData.status]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.value === "TOSHIP") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        shippingDate: new Date().toISOString().slice(0, 10),
      }));
    }
    if (e.target.value === "TORECIEVE") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        realityDeliveryDate: new Date().toISOString().slice(0, 10),
      }));
    }
  };

  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFormData = { ...formData };

    if (updatedFormData.shippingDate) {
      updatedFormData.shippingDate = dayjs(
        formData.shippingDate,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY");
    }
    if (updatedFormData.realityDeliveryDate) {
      updatedFormData.realityDeliveryDate = dayjs(
        formData.realityDeliveryDate,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY");
    }
    if (updatedFormData.etd) {
      updatedFormData.etd = dayjs(formData.etd, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );
    }
    if (updatedFormData.eta) {
      updatedFormData.eta = dayjs(formData.eta, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );
    }
    if (updatedFormData.requestedDeliveryDate) {
      updatedFormData.requestedDeliveryDate = dayjs(
        formData.requestedDeliveryDate,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY");
    }
    if (formData.status == "TOSHIP") {
      axios
        .get(
          `http://localhost:8099/api/schedule?orderNumber=${formData.orderNumber}`
        )
        .then((response) => {
          if (response.data.totalElements == "0") {
            toast.error("Đơn hàng chưa được điều phối!");
          } else {
            axios
              .put(
                `http://localhost:8099/api/order/${orderId}`,
                updatedFormData
              )
              .then((response) => {
                window.location.reload();
                toast.success("Cập nhật đơn hàng thành công!");
              })
              .catch((error) => {
                console.error("Error updating order:", error);
                toast.error("Cập nhật đơn hàng thất bại!");
              });
          }
        });
    } else {
      axios
        .put(`http://localhost:8099/api/order/${orderId}`, updatedFormData)
        .then((response) => {
          window.location.reload();
          toast.success("Cập nhật đơn hàng thành công!");
        })
        .catch((error) => {
          console.error("Error updating order:", error);
          toast.error("Cập nhật đơn hàng thất bại!");
        });
    }
  };
  return (
    <>
      <Breadcrumb pageName="Thông tin đơn hàng" />
      <div>
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="bg-gray-2 border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3
                className="font-medium text-black dark:text-white "
                style={{ display: "inline-block" }}
              >
                Thông tin đơn hàng
              </h3>
              <h3
                className="font-medium text-black dark:text-white "
                style={{ display: "inline-block", float: "right" }}
              >
                Mã đơn hàng :{orderNumber}
              </h3>
            </div>
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={activestep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <form action="#" onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Trạng thái
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                      <InputLabel id="label_delect_status">status</InputLabel>
                      <Select
                        name="status"
                        labelId="label_delect_status"
                        id="select_status"
                        readOnly={formData.status === "PENDING"}
                        value={formData.status}
                        label="Tài xế"
                        onChange={handleChange}
                      >
                        {curentStatus === "PENDING" && (
                          <MenuItem key="pending" value="PENDING">
                            Chờ xác nhận
                          </MenuItem>
                        )}
                        {curentStatus === "CONFIRM" && [
                          <MenuItem key="confirm" value="CONFIRM">
                            Đã xác nhận
                          </MenuItem>,
                          <MenuItem key="toship" value="TOSHIP">
                            Đang giao hàng
                          </MenuItem>,
                        ]}
                        {curentStatus === "TOSHIP" && [
                          <MenuItem key="toship" value="TOSHIP">
                            Đang giao hàng
                          </MenuItem>,
                          <MenuItem key="TORECIEVE" value="TORECIEVE">
                            Đã nhận hàng
                          </MenuItem>,

                        ]}
                        {curentStatus === "TORECIEVE" && [
                          <MenuItem key="TORECIEVE" value="TORECIEVE">
                            Đã nhận hàng
                          </MenuItem>,
                          <MenuItem key="COMPLETED" value="COMPLETED">
                            Hoàn thành
                          </MenuItem>,
                        ]}
                        {curentStatus === "COMPLETED" && (
                          <MenuItem key="COMPLETED" value="COMPLETED">
                            Hoàn thành
                          </MenuItem>
                        )}
                        {/* <MenuItem value="CONFIRM">Đã xác nhận</MenuItem>
                        <MenuItem value="TOSHIP">Đang giao hàng</MenuItem>
                        <MenuItem value="TORECIEVE">Đã nhận hàng</MenuItem>
                        <MenuItem value="COMPLETED">Hoàn thành</MenuItem> */}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Phương thức thanh toán
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                      <InputLabel id="label_delect_payment">None</InputLabel>
                      <Select
                        name="payment"
                        labelId="label_delect_payment"
                        id="select_payment"
                        label="payment"
                        readOnly
                        value={formData.payment}
                        onChange={handleChange}
                      >
                        <MenuItem value="TIỀN_MẶT">Tiền mặt</MenuItem>
                        <MenuItem value="BANKING">Banking</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Trạng thái thanh toán
                    </label>
                    <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                      <InputLabel id="label_delect_payment">status</InputLabel>
                      <Select
                        name="paid"
                        labelId="label_delect_paid"
                        id="select_payment"
                        label="paid"
                        readOnly
                        value={formData.paid}
                        onChange={handleChange}
                      >
                        <MenuItem value="true">Đã thanh toán</MenuItem>
                        <MenuItem value="false">Chưa thanh toán</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Tiền đơn hàng (VND)
                    </label>
                    <input
                      type="text"
                      name="price"
                      readOnly
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style} style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "400px",
                          marginBottom: "30px",
                          marginRight: "20px",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            marginBottom: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Quãng đường dự kiến
                        </div>
                        <div
                          style={{ border: "2px solid black", height: "100%" }}
                        >
                          {showMap && (
                            <MFMap
                              options={{
                                center: center
                                  ? center
                                  : { lat: 21.01528, lng: 105.52842 },
                                zoom: 15,
                                controls: true,
                              }}
                              accessKey={"a05f1551557fd15b7dc77c9d6f7094f8"}
                              version={"2.4"}
                            >
                              <MFDirectionsRenderer routes={routeGeometry} />
                            </MFMap>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "400px",
                          marginBottom: "30px",
                        }}
                      >
                        <div
                          style={{
                            textAlign: "center",
                            marginBottom: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          Quãng đường thực tế
                        </div>
                        <div
                          style={{ border: "2px solid black", height: "100%" }}
                        >
                          {showMap && (
                            <MFMap
                              options={{
                                center: center
                                  ? center
                                  : { lat: 21.01528, lng: 105.52842 },
                                zoom: 15,
                                controls: true,
                              }}
                              accessKey={"a05f1551557fd15b7dc77c9d6f7094f8"}
                              version={"2.4"}
                            >
                              {secondLocation && (
                                <MFMarker
                                  label="1"
                                  position={{
                                    lat: firstLocation.split(",")[0],
                                    lng: firstLocation.split(",")[1],
                                  }}
                                />
                              )}
                              {thirdLocation && (
                                <MFMarker
                                  label="2"
                                  position={{
                                    lat: secondLocation.split(",")[0],
                                    lng: secondLocation.split(",")[1],
                                  }}
                                />
                              )}
                              {destinationLocation && (
                                <MFMarker
                                  label="3"
                                  position={{
                                    lat: thirdLocation.split(",")[0],
                                    lng: thirdLocation.split(",")[1],
                                  }}
                                />
                              )}
                              <MFDirectionsRenderer routes={routeGeometry1} />
                            </MFMap>
                          )}
                        </div>
                      </div>
                    </Box>
                  </Modal>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày giao hàng
                    </label>
                    <input
                      type="date"
                      name="shippingDate"
                      readOnly
                      value={formData.shippingDate}
                      onChange={handleChange}
                      placeholder="Enter your first name"
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
                      readOnly
                      value={formData.etd}
                      onChange={handleChange}
                      placeholder="Enter your last name"
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
                      readOnly
                      value={formData.eta}
                      onChange={handleChange}
                      placeholder="Enter your first name"
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
                      readOnly
                      value={formData.requestedDeliveryDate}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Ngày nhận hàng
                    </label>
                    <input
                      type="date"
                      name="realityDeliveryDate"
                      readOnly
                      value={formData.realityDeliveryDate}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nơi giao hàng
                    </label>
                    <input
                      type="text"
                      name="shippingAddress"
                      readOnly
                      value={formData.shippingAddress}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Nơi nhận hàng
                    </label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      readOnly
                      value={formData.deliveryAddress}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Chi tiết đơn hàng
                    </label>
                    <textarea
                      style={{ height: "100px" }}
                      name="description"
                      value={formData.description}
                      onChange={handleChangeText}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleOpen}
                    style={{
                      height: "50px",
                      width: "120px",
                      marginLeft: "400px", // Thêm margin bên trái
                      marginTop: "50px",
                    }}
                  >
                    xem vị trí
                  </Button>
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

export default OrderDetail;
