import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { user } from "../../model/user";
import { useState, useEffect } from "react";
import React, { ChangeEvent } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import toast from "react-hot-toast";

const Employee = () => {
  //react hook
  const axios = useAxiosAuth();
  const navigate = useNavigate();

  //state of Employee
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [fullName, setFullName] = useState("");
  const [userNumber, setuserNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState<user[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userIdInModal, setUserIdInModal] = useState("");
  //clear filter
  const clearFilter = () => {
    setStatus("");
    setRole("");
    setPersonalId("");
    setuserNumber("");
    setPhone("");
    setFullName("");
    debouncedSearch("", "", "", "", "", "");
  };

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

  //state of modal
  const [openCreateAccount, setOpenCreateAccount] = React.useState(false);
  const [openChangeStatus, setOpenChangeStatus] = React.useState(false);
  const handleOpenChangeStatus = (userId: string) => {
    setUserIdInModal(userId);
    setOpenChangeStatus(true);
  };
  const handleOpenCreateAccount = (userId: string) => {
    setUserIdInModal(userId);
    setOpenCreateAccount(true);
  };
  const handleClose = async () => {
    setOpenChangeStatus(false);
    setOpenCreateAccount(false);
    // window.location.reload();
    try {
      let apiUrl = `http://localhost:8099/api/user?isEmployee=true&page=${currentPage - 1
        }&size=7`;
      if (personalId) {
        apiUrl += `&personalId=${personalId}`;
      }
      if (fullName) {
        apiUrl += `&fullName=${fullName}`;
      }
      if (userNumber) {
        apiUrl += `&userNumber=${userNumber}`;
      }
      if (phone) {
        apiUrl += `&phone=${phone}`;
      }
      if (role) {
        apiUrl += `&role=${role}`;
      }
      if (status) {
        apiUrl += `&isActive=${status}`;
      }

      const response = await axios.get(apiUrl);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleModalConfirmChangeStatus = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:8099/api/user/${userId}`);
      handleClose();
      toast.success("Đổi mới trạng thái thành công!");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };
  const handleModalConfirmCreateAccount = async (userId: string) => {
    await axios
      .post(`http://localhost:8099/api/account/${userId}`)
      .then((response) => {
        handleClose();
        toast.success("Tạo tài khoản thành công!");
      })
      .catch((error) => {
        toast.error("Tạo mới tài khoản thất bại!");
      });
  };

  //fetch data of Employee
  useEffect(() => {
    axios
      .get("http://localhost:8099/api/user?page=0&size=7&isEmployee=true")
      .then((response) => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  //Pagination
  const handlePageClick = (event: any, page: number) => {
    setCurrentPage(page);
    try {
      let apiUrl = `http://localhost:8099/api/user?page=${page - 1
        }&size=7&isEmployee=true`;

      if (personalId) {
        apiUrl += `&personalId=${personalId}`;
      }

      if (fullName) {
        apiUrl += `&fullName=${fullName}`;
      }
      if (userNumber) {
        apiUrl += `&userNumber=${userNumber}`;
      }
      if (phone) {
        apiUrl += `&phone=${phone}`;
      }
      if (role) {
        apiUrl += `&role=${role}`;
      }
      if (status) {
        apiUrl += `&isActive=${status}`;
      }
      axios
        .get(apiUrl)
        .then((response) => {
          setUsers(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  //Searching
  const handleSearchPersonalId = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setPersonalId(inputValue);
    debouncedSearch(inputValue, fullName, userNumber, phone, role, status);
  };
  const handleSearchFullName = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setFullName(inputValue);
    debouncedSearch(personalId, inputValue, userNumber, phone, role, status);
  };
  const handleSearchuserNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setuserNumber(inputValue);
    debouncedSearch(personalId, fullName, inputValue, phone, role, status);
  };
  const handleSearchPhone = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setPhone(inputValue);
    debouncedSearch(personalId, fullName, userNumber, inputValue, role, status);
  };
  const handleSearchRole = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setRole(inputValue);
    debouncedSearch(personalId, fullName, userNumber, phone, inputValue, status);
  };
  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const inputValue = e.target.value;
    setStatus(e.target.value);

    debouncedSearch(personalId, fullName, userNumber, phone, role, inputValue);
  };
  const debouncedSearch = debounce(
    async (
      personalId: string,
      fullName: string,
      userNumber: string,
      phone: string,
      role: string,
      status: string
    ) => {
      try {
        let apiUrl = `http://localhost:8099/api/user?isEmployee=true&page=0&size=7`;

        if (personalId) {
          apiUrl += `&personalId=${personalId}`;
        }

        if (fullName) {
          apiUrl += `&fullName=${fullName}`;
        }
        if (userNumber) {
          apiUrl += `&userNumber=${userNumber}`;
        }
        if (phone) {
          apiUrl += `&phone=${phone}`;
        }
        if (role) {
          apiUrl += `&role=${role}`;
        }
        if (status) {
          apiUrl += `&isActive=${status}`;
        }
        const response = await axios.get(apiUrl);
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    300
  ); // Debounce for 300 milliseconds
  return (
    <>
      <div className="flex items-center justify-between text-black">
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          QUẢN LÍ NHÂN VIÊN
        </div>
        <div>
          <Link
            to="addemployee"
            className="inline-flex items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6"
          >
            + Tạo mới
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-2 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-2.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white xl:pl-2">
                    CCCD
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Họ và tên
                  </th>

                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã nhân viên
                  </th>

                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Số điện thoại
                  </th>

                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Vai trò
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Trạng Thái
                  </th>
                  <th className="py-1 px-1 font-bold text-black dark:text-white"></th>
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-2 px-2 font-normal  text-black dark:text-white xl:pl-2">
                    <input
                      type="text"
                      name="searchPersonalId"
                      value={personalId}
                      onChange={handleSearchPersonalId}
                      className="w-full  bg-white border-0 outline-none focus:outline-none rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <input
                      type="text"
                      name="searchFullName"
                      value={fullName}
                      onChange={handleSearchFullName}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <input
                      type="text"
                      name="searchuserNumber"
                      value={userNumber}
                      onChange={handleSearchuserNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <input
                      type="text"
                      name="searchPhone"
                      value={phone}
                      onChange={handleSearchPhone}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="label_filter_status">Vai trò</InputLabel>
                      <Select
                        className="bg-white "
                        name="role"
                        labelId="label_delect_driver"
                        id="select_driver"
                        value={role !== undefined ? role : ""}
                        label="Tài xế"
                        onChange={handleSearchRole}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="DRIVER">Tài xế</MenuItem>
                        <MenuItem value="STAFF">Quản lí</MenuItem>
                      </Select>
                    </FormControl>
                  </th>

                  <th className="min-w-[80px] py-2 px-2 font-normal text-black dark:text-white">
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="label_filter_status">
                        Trạng thái
                      </InputLabel>
                      <Select
                        className="bg-white "
                        name="isActive"
                        labelId="label_delect_driver"
                        id="select_driver"
                        value={status !== undefined ? status : ""}
                        label="Tài xế"
                        onChange={handleStatusChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="true">Đang hoạt động</MenuItem>
                        <MenuItem value="false">Ngừng hoạt động</MenuItem>
                      </Select>
                    </FormControl>
                  </th>
                  <th className="py-2 px-2">
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
                          fill="black"
                          d="M14.76 20.83L17.6 18l-2.84-2.83l1.41-1.41L19 16.57l2.83-2.81l1.41 1.41L20.43 18l2.81 2.83l-1.41 1.41L19 19.4l-2.83 2.84zM12 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0L8.29 18.7a.99.99 0 0 1-.29-.83V12h-.03L2.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L12.03 12z"
                        ></path>
                      </svg>
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr className="text-center" key={user.userId}>
                      <td className="border-b border-[#eee] hover:cursor-pointer  py-2 px-2 pl-2 dark:border-strokedark xl:pl-2">
                        <h5 className="font-medium hover:text-primary text-black dark:text-white">
                          {user.personalId && (
                            <p className="text-black ">{user.personalId}</p>
                          )}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {user.firstName && (
                          <p className="text-black ">
                            {user.firstName} {user.lastName}
                          </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {user.userNumber && (
                          <p className="text-black ">{user.userNumber} </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {user.phone && (
                          <p className="text-black ">{user.phone} </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        {user.birthDate && user.role == "DRIVER" && (
                          <p className="text-black "> Tài xế </p>
                        )}
                        {user.birthDate && user.role == "STAFF" && (
                          <p className="text-black "> Quản lí</p>
                        )}
                      </td>
                      {/* Action */}
                      <td className="border-b border-[#eee] py-5 px-1 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          {user.isActive ? (
                            <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-1 text-sm font-medium text-success">
                              Hoạt động
                            </p>
                          ) : (
                            <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-1 text-sm font-medium text-danger">
                              Tạm ngừng
                            </p>
                          )}
                          <button
                            onClick={() =>
                              handleOpenChangeStatus(
                                user.userId ? user.userId : ""
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
                              className="w-4.5 h-4.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                              />
                            </svg>
                          </button>

                          {user.hasAccount || (
                            <span
                              className="text-gray-700 relative inline-block"
                              title="Tạo tài khoản" // Tooltip text
                            >
                              <PersonAddAlt1Icon
                                className="h-6 w-6 transition duration-300 transform hover:scale-110"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                // onClick={() => handleCreateNewUser(user.userId)}
                                onClick={() =>
                                  handleOpenCreateAccount(
                                    user.userId ? user.userId : ""
                                  )
                                }
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </PersonAddAlt1Icon>
                            </span>
                          )}

                          <Modal
                            open={openCreateAccount}
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
                                Thông báo!
                              </Typography>
                              <Typography
                                id="modal-modal-description"
                                sx={{ mt: 3 }}
                              >
                                Bạn có muốn tạo tài khoản cho người dùng này
                                không?
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
                                  onClick={() =>
                                    handleModalConfirmCreateAccount(
                                      userIdInModal
                                    )
                                  }
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
                            open={openChangeStatus}
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
                                Thông báo!
                              </Typography>
                              <Typography
                                id="modal-modal-description"
                                sx={{ mt: 3 }}
                              >
                                Bạn có muốn thay đổi trạng thái người dùng
                                không?
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
                                  onClick={() =>
                                    handleModalConfirmChangeStatus(
                                      userIdInModal
                                    )
                                  }
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
                        </div>
                      </td>
                      <td className="border-b border-[#eee] py-2 px-2 dark:border-strokedark">
                        <button
                          onClick={() => navigate("/users/" + user.userId)}
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
                      </td>
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
                count={totalPages}
                variant="outlined"
                onChange={handlePageClick}
              />
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
};

export default Employee;
