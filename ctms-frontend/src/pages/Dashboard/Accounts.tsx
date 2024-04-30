import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import { account } from "../../model/account";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
const Accounts = () => {
  const axios = useAxiosAuth();
  const [status, setStatus] = useState("");
  const [accountId, setAccountId] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [accounts, setAccounts] = useState<account[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  //fetch data account
  useEffect(() => {
    axios
      .get("http://localhost:8099/api/account?page=0&size=7")
      .then((response) => {
        setAccounts(response.data.content);
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
      let apiUrl = `http://localhost:8099/api/account?page=${page - 1}&size=7`;

      if (accountId) {
        apiUrl += `&accountId=${accountId}`;
      }

      if (username) {
        apiUrl += `&username=${username}`;
      }
      if (role) {
        apiUrl += `&role=${role}`;
      }
      axios
        .get(apiUrl)
        .then((response) => {
          setAccounts(response.data.content);
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
  const handleSearchUserName = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setUsername(inputValue);
    debouncedSearch(accountId, inputValue, role, status);
  };
  const handleSearchRole = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setRole(inputValue);
    debouncedSearch(accountId, username, inputValue, status);
  };
  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    const inputValue = e.target.value;
    setStatus(e.target.value);

    debouncedSearch(accountId, username, role, inputValue);
  };
  const debouncedSearch = debounce(
    async (
      accountId: string,
      username: string,
      role: string,
      status: string
    ) => {
      try {
        let apiUrl = `http://localhost:8099/api/account?page=0&size=7`;
        if (accountId) {
          apiUrl += `&accountId=${accountId}`;
        }

        if (username) {
          apiUrl += `&username=${username}`;
        }
        if (role) {
          apiUrl += `&role=${role}`;
        }
        if (status) {
          apiUrl += `&isActive=${status}`;
        }

        const response = await axios.get(apiUrl);
        setAccounts(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    300
  ); // Debounce for 300 milliseconds

  return (
    <>
      <div className="flex items-center justify-between mt-2">
        <div
          style={{ fontSize: "24px", fontWeight: "bold" }}
          className="text-black"
        >
          QUẢN LÍ TÀI KHOẢN
        </div>
      </div>
      <div className="flex flex-col gap-10 justify-center items-center">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 w-1/2">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-4 px-4 font-bold text-black dark:text-white">
                    Tài Khoản
                  </th>
                  <th className="min-w-[80px] py-4 px-4 font-bold text-black dark:text-white">
                    Vai Trò
                  </th>
                  <th className="min-w-[80px] py-4 px-4 font-bold text-black dark:text-white">
                    Trạng Thái
                  </th>

                  <th className="py-4 px-4 font-bold text-black dark:text-white"></th>
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-4 px-4 font-normal text-black dark:text-white">
                    <input
                      type="text"
                      name="searchUserName"
                      value={username}
                      onChange={handleSearchUserName}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-4 px-4 font-normal text-black dark:text-white">
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="label_filter_status">Vai trò</InputLabel>
                      <Select
                        className="bg-white "
                        name="role"
                        labelId="label_delect_role"
                        id="select_role"
                        value={role !== undefined ? role : ""}
                        label="Tài xế"
                        onChange={handleSearchRole}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>

                        <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
                        <MenuItem value="STAFF">Quản lí</MenuItem>
                        <MenuItem value="DRIVER">Tài xế</MenuItem>
                      </Select>
                    </FormControl>
                  </th>

                  <th className="min-w-[80px] py-4 px-4 font-normal text-black dark:text-white">
                    <FormControl sx={{ m: 0, minWidth: 150 }} size="small">
                      <InputLabel id="label_filter_status">
                        Trạng thái
                      </InputLabel>
                      <Select
                        className="bg-white"
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
                  <th className="py-4 px-4 font-normal text-black dark:text-white"></th>
                </tr>
              </thead>
              <tbody>
                {accounts && accounts.length > 0 ? (
                  accounts.map((account) => (
                    <tr className="text-center" key={account.accountId}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {account.username && (
                          <p className="text-black ">{account.username} </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {account.role && account.role === "CUSTOMER" && (
                          <p className="text-black "> Khách hàng</p>
                        )}
                        {account.role && account.role === "STAFF" && (
                          <p className="text-black "> Quản lí</p>
                        )}
                        {account.role && account.role === "DRIVER" && (
                          <p className="text-black "> Tài xế</p>
                        )}
                      </td>

                      {/* Action */}
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          {account.isActive ? (
                            <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                              Hoạt động
                            </p>
                          ) : (
                            <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                              Tạm ngừng
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark"></td>
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

export default Accounts;
