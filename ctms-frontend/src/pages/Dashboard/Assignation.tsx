import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import React, { ChangeEvent } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { order } from "../../model/order";
import { MFDirectionsRenderer, MFMap, MFMarker } from "react-map4d-map";
import { ContainerTruck } from "../../model/truck";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
//style of modal
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

const Assignation = () => {
  //hook
  const axios = useAxiosAuth();
  const navigate = useNavigate();
  //modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    const hasFalseValue = Object.values(checkedBoxOrder).some(
      (value) => value === false
    );
    const hasFalseValue1 = Object.values(checkedBoxTruck).some(
      (value) => value === false
    );
    if (hasFalseValue || orderId == "") {
      toast.error("Vui lòng chọn đơn hàng!");
    }

    if (hasFalseValue1 || truckId == "") {
      toast.error("Vui lòng chọn xe!");
    }
    if (!hasFalseValue && !hasFalseValue1 && truckId != "" && orderId != "") {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);

  //map
  const [routeGeometry, setRouteGeometry] = useState([]);
  const [showMap, setShowMap] = useState(true);

  //oder
  const [orderNumber, setOrderNumber] = useState("");
  const [orderNumberInMoal, setOrderNumberInMoadal] = useState("");
  const [orderId, setOrderId] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [eta, setEta] = useState("");
  const [etd, setEtd] = useState("");
  const [orders, setOrders] = useState<order[]>([]);
  const [totalPagesOrder, setTotalPagesOrder] = useState(0);
  const [currentPageOrder, setCurrentPageOrder] = useState<number>(1);
  const [checkedBoxOrder, setCheckedBoxOrder] = useState<{
    [key: string]: boolean;
  }>({});

  //truck
  const [truckId, setTruckId] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [licensePlateInModal, setLicensePlateInModal] = useState("");
  const [driverName, setDriverName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [driverNumber, setDriverNumber] = useState("");
  const [container, setContainer] = useState<ContainerTruck[]>([]);
  const [totalPagesTruck, setTotalPagesTruck] = useState(0);
  const [currentPageTruck, setCurrentPageTruck] = useState<number>(1);
  const [checkedBoxTruck, setCheckedBoxTruck] = useState<{
    [key: string]: boolean;
  }>({});

  //checkbox
  const handleCheckboxChangeTruck = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedBoxTruck({ [name]: checked });
  };
  const handleCheckboxChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCheckedBoxOrder({ [name]: checked });
    const hasFalse = Object.values({
      ...checkedBoxOrder,
      [name]: checked,
    }).some((value) => value === true);
    return hasFalse;
  };

  //fetch map
  useEffect(() => {
    axios
      .get("http://api.map4d.vn/sdk/route", {
        params: {
          origin: "",
          destination: "",
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
  }, []);
  //Fetch Map order detail
  const handleFetchMap = (
    deli: string,
    ship: string,
    orderId: string,
    orderNumber: string,
    hasFlase: boolean
  ) => {
    if (hasFlase) {
      setOrderNumberInMoadal(orderNumber);
      setOrderId(orderId);
      axios
        .get("http://api.map4d.vn/sdk/route", {
          params: {
            origin: deli,
            destination: ship,
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
        .get(
          `http://localhost:8099/api/schedule/order/${orderId}?page=0&size=4`
        )
        .then((response) => {
          setContainer(response.data.content);
          setTotalPagesTruck(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } else {
      axios
        .get(
          `http://localhost:8099/api/schedule/order/3447c611-4f83-4da6-b091-b3ffbc4cae80?page=0&size=4&fullName=1`
        )
        .then((response) => {
          setContainer(response.data.content);
          setTotalPagesTruck(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  };
  const handleCheckBoxTruck = (truckId: string, licensePlate: string) => {
    setTruckId(truckId);
    setLicensePlateInModal(licensePlate);
  };

  //confirm modal
  const handleModalConfirm = async () => {
    try {
      await axios.post(
        `http://localhost:8099/api/schedule?orderId=${orderId}&truckId=${truckId}`
      );
      navigate("/history");
      toast.success("Điều phối thành công!");
      handleClose();
    } catch (error) {
      toast.error("Điều phối thất bại!");
      // console.error('Error deactivating user:', error);
    }
  };

  //fetch order not assign
  useEffect(() => {
    axios
      .get(
        "http://localhost:8099/api/order?hasSchedule=false&status=CONFIRM&page=0&size=4"
      )
      .then((response) => {
        setOrders(response.data.content);
        setTotalPagesOrder(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  //Pagination Order
  const handlePageClickOrder = (event: any, page: number) => {
    setCurrentPageOrder(page);
    try {
      let apiUrl = `http://localhost:8099/api/order?hasSchedule=false&page=${page - 1
        }&size=4`;

      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (userNumber) {
        apiUrl += `&userNumber=${userNumber}`;
      }
      if (fullName) {
        apiUrl += `&fullName=${fullName}`;
      }
      if (eta) {
        apiUrl += `&eta=${eta}`;
      }
      if (etd) {
        apiUrl += `&etd=${etd}`;
      }
      axios
        .get(apiUrl)
        .then((response) => {
          setOrders(response.data.content);
          setTotalPagesOrder(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //Searching
  const handleSearchOrderNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setOrderNumber(inputValue);
    debouncedSearchOrder(inputValue, userNumber, fullName, eta, etd);
  };
  const handleSearchUserNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setUserNumber(inputValue);
    debouncedSearchOrder(orderNumber, inputValue, fullName, eta, etd);
  };
  const handleSearchName = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setFullName(inputValue);
    debouncedSearchOrder(orderNumber, userNumber, inputValue, eta, etd);
  };
  const handleSearchEta = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEta(inputValue);
    debouncedSearchOrder(orderNumber, userNumber, fullName, inputValue, etd);
  };
  const handleSearchEtd = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setEtd(inputValue);
    debouncedSearchOrder(orderNumber, userNumber, fullName, eta, inputValue);
  };
  const debouncedSearchOrder = debounce(
    async (
      orderNumber: string,
      userNumber: string,
      fullName: string,
      eta: string,
      etd: string
    ) => {
      try {
        let apiUrl = `http://localhost:8099/api/order?hasSchedule=false&page=${currentPageOrder - 1
          }&size=4`;

        if (orderNumber) {
          apiUrl += `&orderNumber=${orderNumber}`;
        }
        if (userNumber) {
          apiUrl += `&userNumber=${userNumber}`;
        }
        if (fullName) {
          apiUrl += `&fullName=${fullName}`;
        }
        if (eta) {
          apiUrl += `&eta=${eta}`;
        }
        if (etd) {
          apiUrl += `&etd=${etd}`;
        }
        const response = await axios.get(apiUrl);
        setOrders(response.data.content);
        setTotalPagesOrder(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    300
  ); // Debounce for 300 milliseconds

  //Pagination Truck
  const handlePageClickTruck = (event: any, page: number) => {
    setCurrentPageTruck(page);

    try {
      let apiUrl = `http://localhost:8099/api/schedule/order/${orderId}?size=4&page=${page - 1
        }`;
      if (licensePlate) {
        apiUrl += `&licensePlate=${licensePlate}`;
      }
      if (driverName) {
        apiUrl += `&fullName=${driverName}`;
      }
      if (driverNumber) {
        apiUrl += `&userNumber=${driverNumber}`;
      }
      axios
        .get(apiUrl)
        .then((response) => {
          setContainer(response.data.content);
          setTotalPagesTruck(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //searching
  const handleSearchLicensePlate = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setLicensePlate(inputValue);
    debouncedSearchTruck(truckId, inputValue, driverName, driverNumber);
  };
  const handleSearchDriverName = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setDriverName(inputValue);
    debouncedSearchTruck(truckId, licensePlate, inputValue, driverNumber);
  };
  const handleSearchDriverNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setDriverNumber(inputValue);
    debouncedSearchTruck(truckId, licensePlate, driverName, inputValue);
  };

  const debouncedSearchTruck = debounce(
    async (
      truckId: string,
      licensePlate: string,
      driverName: string,
      driverNumber: string
    ) => {

      try {
        let apiUrl = `http://localhost:8099/api/schedule/order/${orderId}?size=4&page=${currentPageTruck - 1
          }`;
        if (licensePlate) {
          apiUrl += `&licensePlate=${licensePlate}`;
        }
        if (driverName) {
          apiUrl += `&fullName=${driverName}`;
        }
        if (driverNumber) {
          apiUrl += `&userNumber=${driverNumber}`;
        }
        const response = await axios.get(apiUrl);
        setContainer(response.data.content);
        setTotalPagesTruck(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    300
  ); // Debounce for 300 milliseconds

  return (
    <>
      <button
        style={{ marginLeft: "auto" }}
        className="flex w-50 justify-center rounded bg-primary p-3 font-medium text-gray"
        onClick={handleOpen}
      >
        Điều phối
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: "bold" }}
          >
            Xác nhận điều phối
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 3 }}>
            Bạn có muốn xác nhận điều phối đơn hàng {orderNumberInMoal} với xe{" "}
            {licensePlateInModal} không?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              sx={{ ml: 1 }} // Đặt margin-left cho Button đầu tiên để tạo khoảng cách với Button thứ hai
              onClick={() => handleModalConfirm()}
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
          {/* <Button onClick={() => handleModalConfirm()}>Có</Button>
                    <Button onClick={() => handleClose()}>không</Button> */}
        </Box>
      </Modal>
      <div className="flex">
        <div style={{ width: "600px", height: "340px" }}>
          {showMap && (
            <MFMap
              options={{
                center: { lat: 21.01528, lng: 105.52842 },
                zoom: 15,
                controls: true,
              }}
              accessKey={"a05f1551557fd15b7dc77c9d6f7094f8"}
              version={"2.4"}
            >
              <MFMarker
                position={{ lat: 16.072163491469226, lng: 108.22690536081757 }}
              />
              <MFDirectionsRenderer routes={routeGeometry} />
            </MFMap>
          )}
        </div>

        <div className="flex flex-col gap-10 md:w-1/2">
          <div className="rounded-sm border border-stroke bg-white px-1 pt-1 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-0.5 xl:pb-1">
            <div className="w-full  overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-secondary hover:cursor-default">
                    <th className="min-w-[5px] py-1 px-1 font-bold text-black dark:text-white">
                      Biển số xe
                    </th>
                    <th className="min-w-[5px] py-1 px-1 font-bold text-black dark:text-white">
                      Tài xế
                    </th>
                    <th className="min-w-[5px] py-1 px-1 font-bold text-black dark:text-white">
                      Mã tài xế
                    </th>
                    <th className="py-4 px-4 font-bold text-black dark:text-white"></th>
                  </tr>
                  <tr className="bg-secondary hover:cursor-default">
                    <th className="min-w-[5px] py-1 px-1 font-bold text-black dark:text-white">
                      <input
                        type="text"
                        name="searchLicensePlatet"
                        value={licensePlate}
                        onChange={handleSearchLicensePlate}
                        className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                      />
                    </th>
                    <th className="min-w-[5px] py-1 px-1 font-bold text-black dark:text-white">
                      <input
                        type="text"
                        name="searchDriverName"
                        value={driverName}
                        onChange={handleSearchDriverName}
                        className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                      />
                    </th>
                    <th className="min-w-[5px] py-1 px-1 font-bold text-black dark:text-white">
                      <input
                        type="text"
                        name="searchUserNumber"
                        value={driverNumber}
                        onChange={handleSearchDriverNumber}
                        className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                      />
                    </th>

                    <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {container && container.length > 0 ? (
                    container.map((truck) => (
                      <tr className="text-center" key={truck.truckId}>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {truck.licensePlate && (
                            <p className="text-black ">{truck.licensePlate}</p>
                          )}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {truck.driver?.firstName && (
                            <p className="text-black ">
                              {" "}
                              {truck.driver.firstName} {truck.driver.lastName}
                            </p>
                          )}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {truck.driver?.userNumber && (
                            <p className="text-black ">
                              {truck.driver?.userNumber}{" "}
                            </p>
                          )}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black ">
                            <input
                              type="checkbox"
                              name={truck.truckId}
                              checked={
                                (truck &&
                                  truck.truckId &&
                                  checkedBoxTruck[truck.truckId]) ||
                                false
                              }
                              onChange={handleCheckboxChangeTruck}
                              onClick={() => {
                                handleCheckBoxTruck(
                                  truck.truckId || "default",
                                  truck.licensePlate
                                );
                              }}
                            />{" "}
                          </p>
                        </td>
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
                  count={totalPagesTruck}
                  variant="outlined"
                  onChange={handlePageClickTruck}
                />
              </Stack>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-10 ">
        <div className="rounded-sm border border-stroke bg-white px-1 pt-1 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-0.5 xl:pb-1">
          <div className="w-full  overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white xl:pl-1">
                    Mã đơn hàng
                  </th>
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã khách hàng
                  </th>
                  <th className="min-w-[40px] py-1 px-1 font-bold text-black dark:text-white">
                    Khách hàng
                  </th>
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white">
                    ETD
                  </th>
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white">
                    ETA
                  </th>
                  <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white xl:pl-1">
                    <input
                      type="text"
                      name="searchPersonalId"
                      value={orderNumber}
                      onChange={handleSearchOrderNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="text"
                      name="searchUserNumber"
                      value={userNumber}
                      onChange={handleSearchUserNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[80px] py-3 px-3 font-bold text-black dark:text-white">
                    <input
                      type="text"
                      name="searchname"
                      value={fullName}
                      onChange={handleSearchName}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="date"
                      name="searchEtd"
                      value={etd}
                      onChange={handleSearchEtd}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[4px] py-1 px-1 font-bold text-black dark:text-white">
                    <input
                      type="date"
                      name="searchEta"
                      value={eta}
                      onChange={handleSearchEta}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                </tr>
              </thead>

              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr className="text-center">
                      <td className="border-b border-[#eee] hover:cursor-pointer  py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium hover:text-primary text-black dark:text-white ">
                          {order.orderNumber && (
                            <p className="text-black ">{order.orderNumber}</p>
                          )}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {order.customer?.personalId && (
                          <p className="text-black ">
                            {order.customer?.userNumber}{" "}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {order.customer?.firstName && (
                          <p className="text-black ">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {order.etd && (
                          <p className="text-black ">{order.etd} </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {order.eta && (
                          <p className="text-black ">{order.eta} </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {order.orderId && (
                          <p className="text-black " key={order.orderId}>
                            <input
                              type="checkbox"
                              name={order.orderId}
                              checked={checkedBoxOrder[order.orderId] || false}
                              onChange={(event) => {
                                const hasFalse =
                                  handleCheckboxChangeOrder(event);
                                handleFetchMap(
                                  order.deliveryAddress,
                                  order.shippingAddress,
                                  order.orderId,
                                  order.orderNumber,
                                  hasFalse
                                );
                              }}
                            />
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
                count={totalPagesOrder}
                variant="outlined"
                onChange={handlePageClickOrder}
              />
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
};

export default Assignation;
