import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import CreateIcon from "@mui/icons-material/Create";
import { user } from "../model/user";
import { useState, useEffect } from "react";
import axios from "axios";
import React, { ChangeEvent } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { MenuItem } from "@mui/material";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
const label = { inputProps: { "aria-label": "Switch demo" } };
const TableOne = () => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [userIdInModal, setUserIdInModal] = useState("");
  const [roleOfUser, setRoleOfUser] = useState("");
  const [query, setQuery] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState<user[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:8099/api/user?page=0&size=4")
      .then((response) => {
        setUsers(response.data.content);
        setTotalUsers(response.data.totalElements);
        setTotalPages(response.data.totalPages);
        console.log("Data from API:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const [open, setOpen] = React.useState(false);
  const handleOpen = (userId: string) => {
    setUserIdInModal(userId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleCreateNewUser = (userId: string) => {
    axios
      .post(`http://localhost:8099/api/account/${userId}`)
      .then((response) => {
        console.log("account created successfully:");
        // Xử lý sau khi tạo thành công, ví dụ: hiển thị thông báo
        alert("User created successfully!");
      })
      .catch((error) => {
        console.error("Error creating user:", error);

        // Xử lý sau khi gặp lỗi, ví dụ: hiển thị thông báo lỗi
        alert("Error creating user. Please try again.");
      });
  };
  const handlePageClick = (event: any, page: number) => {
    console.log(page);

    try {
      let apiUrl = `http://localhost:8099/api/user?page=${page - 1}&size=4`;

      if (query) {
        apiUrl += `&address=${query}`;
      }

      if (roleOfUser) {
        apiUrl += `&role=${roleOfUser}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          setUsers(response.data.content);
          setTotalUsers(response.data.totalElements);
          setTotalPages(response.data.totalPages);
          console.log("Data from API:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  const handleDriverChange = (e: SelectChangeEvent<string>) => {
    setRoleOfUser(e.target.value);

    console.log(e.target.value);
  };
  const handleSearchSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      let apiUrl = `http://localhost:8099/api/user?page=0&size=4&`;

      if (query) {
        apiUrl += `address=${query}&`;
      }

      if (roleOfUser) {
        apiUrl += `role=${roleOfUser}`;
      }

      const response = await axios.get(apiUrl);
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleModalConfirm = async (userId: string) => {
    try {
      // Thực hiện gửi request API để deactive user
      await axios.delete(`http://localhost:8099/api/user/${userId}`);
      // Xử lý thành công, có thể cập nhật state hoặc thực hiện các hành động khác
      console.log("User deactivated successfully!");
      handleClose();
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error deactivating user:", error);
    }
    console.log(userId);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Quản lí người dùng
      </h4>

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter search query"
          value={query}
          onChange={handleSearchChange}
        />
        <Select
          name="role"
          labelId="label_delect_driver"
          id="select_driver"
          label="Tài xế"
          onChange={handleDriverChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="DRIVER">Tài xế</MenuItem>
          <MenuItem value="STAFF">Quản Lí</MenuItem>
          <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
        </Select>
        <button type="submit">Search</button>
      </form>
      <div className="flex flex-col">
        <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              CCCD
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Họ tên
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ngày sinh
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Địa chỉ nhà
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Số điện thoại
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Trạng thái
            </h5>
          </div>
        </div>
        <div>
          {users.map((user) => (
            <div
              key={user.userId}
              className="grid grid-cols-7 border-b border-stroke dark:border-strokedark sm:grid-cols-7"
            >
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{user.personalId}</p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black-3">
                  {user.firstName} {user.lastName}
                </p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{user.birthDate}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black-5">{user.address}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black-5">{user.phone}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black-5">{user.email}</p>
              </div>
              <div className=" items-center justify-center p-2.5 sm:flex xl:p-5">
                <Link to={`/users/${user.userId}`}>
                  <CreateIcon />
                </Link>
                {user.isActive ? (
                  <Switch
                    {...label}
                    defaultChecked
                    onClick={() => handleOpen(user.userId)}
                  />
                ) : (
                  <Switch {...label} onClick={() => handleOpen(user.userId)} />
                )}
                <AddCircleOutlineIcon
                  onClick={() => handleCreateNewUser(user.userId)}
                />

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
                    >
                      Cảnh báo!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Bạn có muốn thay đổi trạng thái người dùng không?
                    </Typography>
                    <Button onClick={() => handleModalConfirm(userIdInModal)}>
                      Có
                    </Button>
                  </Box>
                </Modal>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Pagination
          count={totalPages}
          variant="outlined"
          onChange={handlePageClick}
        />
      </Stack>
    </div>
  );
};

export default TableOne;
