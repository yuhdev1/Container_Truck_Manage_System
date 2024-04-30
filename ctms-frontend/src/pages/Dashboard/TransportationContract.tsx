import {
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { SelectChangeEvent } from "@mui/material";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import { TransportationContracts } from "../../model/transportationcontract";

const TransportationContract = () => {
  //hook
  const axios = useAxiosAuth();
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  //state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [contractNumber, setContractNumber] = useState("");
  const [userNumber, setUserNumber] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [deposit, setDeposit] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [contracts, setContracts] = useState<TransportationContracts[]>([]);
  const navigate = useNavigate();
  const clearFilter = () => {
    setOrderNumber("");
    setUserNumber("");
    setContractNumber("");
    setDeposit("");
    setTotalPrice("");
    debouncedSearch("", "", "", "", "");
  };
  useEffect(() => {
    axios
      .get("http://localhost:8099/api/contract/transportation?page=0&size=7")
      .then((response) => {
        setContracts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handlePageClick = (event: any, page: number) => {
    setCurrentPage(page);

    try {
      let apiUrl = `http://localhost:8099/api/contract/transportation?page=${page - 1
        }&size=7`;
      if (contractNumber) {
        apiUrl += `&contractNumber=${contractNumber}`;
      }
      if (userNumber) {
        apiUrl += `&userNumber=${userNumber}`;
      }
      if (orderNumber) {
        apiUrl += `&orderNumber=${orderNumber}`;
      }
      if (deposit) {
        apiUrl += `&deposit=${deposit}`;
      }
      if (totalPrice) {
        apiUrl += `&totalPrice=${totalPrice}`;
      }

      axios
        .get(apiUrl)
        .then((response) => {
          setContracts(response.data.content);
          setTotalPages(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  //
  const handleSearchContractNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setContractNumber(inputValue);
    debouncedSearch(inputValue, userNumber, orderNumber, deposit, totalPrice);
  };
  const handleSearchuserNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setUserNumber(inputValue);
    debouncedSearch(contractNumber, inputValue, orderNumber, deposit, totalPrice);
  };
  const handleSearchOrerNumber = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setOrderNumber(inputValue);
    debouncedSearch(contractNumber, userNumber, inputValue, deposit, totalPrice);
  };
  const handleSearchDeposit = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setDeposit(inputValue);
    debouncedSearch(contractNumber, userNumber, orderNumber, inputValue, totalPrice);
  };
  const handleSearchTotalPrice = async (event: SelectChangeEvent<string>) => {
    const inputValue = event.target.value;
    setTotalPrice(inputValue);
    debouncedSearch(contractNumber, userNumber, orderNumber, deposit, inputValue);
  };



  const debouncedSearch = debounce(
    async (
      contractNumber: string,
      userNumber: string,
      orderNumber: string,
      deposit: string,
      totalPrice: string
    ) => {
      try {
        let apiUrl = `http://localhost:8099/api/contract/transportation?page=0&size=7`;
        if (contractNumber) {
          apiUrl += `&contractNumber=${contractNumber}`;
        }
        if (userNumber) {
          apiUrl += `&userNumber=${userNumber}`;
        }
        if (orderNumber) {
          apiUrl += `&orderNumber=${orderNumber}`;
        }
        if (deposit) {
          apiUrl += `&deposit=${deposit}`;
        }
        if (totalPrice) {
          apiUrl += `&totalPrice=${totalPrice}`;
        }
        const response = await axios.get(apiUrl);
        setContracts(response.data.content);
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
          QUẢN LÍ HỢP ĐỒNG VẬN CHUYỂN
        </div>
        <div>
          <Link
            to="addcontract"
            className="inline-flex items-center justify-center rounded-md  bg-primary py-2 px-7 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6"
          >
            + Tạo mới
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-10 justify-center items-center">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1  w-full">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white xl:pl-11">
                    Mã hợp đồng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã khách hàng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Mã đơn hàng
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Tiền cọc
                  </th>
                  <th className="min-w-[80px] py-1 px-1 font-bold text-black dark:text-white">
                    Tiền đơn hàng
                  </th>

                  <th className="py-4 px-4 font-bold text-black dark:text-white"></th>
                </tr>
                <tr className="bg-secondary hover:cursor-default">
                  <th className="min-w-[80px] py-3 px-3 font-normal text-black dark:text-white xl:pl-11">
                    <input
                      type="text"
                      name="searchcontractNumber"
                      value={contractNumber}
                      onChange={handleSearchContractNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-3 px-3 font-normal text-black dark:text-white ">
                    <input
                      type="text"
                      name="searchuserNumber"
                      value={userNumber}
                      onChange={handleSearchuserNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>

                  <th className="min-w-[80px] py-3 px-3 font-normal text-black dark:text-white">
                    <input
                      type="text"
                      name="searchorderNumber"
                      value={orderNumber}
                      onChange={handleSearchOrerNumber}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"
                    />
                  </th>
                  <th className="min-w-[80px] py-3 px-3 font-normal text-black dark:text-white">
                    <input
                      type="number"
                      name="searchDeposit"
                      value={deposit}
                      onChange={handleSearchDeposit}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"

                    />
                  </th>
                  <th className="min-w-[80px] py-3 px-3 font-normal text-black dark:text-white">
                    <input
                      type="number"
                      name="searchTotalPrice"
                      value={totalPrice}
                      onChange={handleSearchTotalPrice}
                      className="w-full  bg-white   focus:outline-none border-0 rounded-md"

                    />
                  </th>

                  <th className="py-3 px-3 font-normal text-black dark:text-white">
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
                {contracts && contracts.length > 0 ? (
                  contracts.map((contract) => (
                    <tr className="text-center" key={contract.id}>
                      <td className="border-b border-[#eee] hover:cursor-pointer  py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium hover:text-primary text-black dark:text-white">
                          {contract.contractNumber && (
                            <p className="text-black ">
                              {contract.contractNumber}
                            </p>
                          )}
                        </h5>
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {contract.customer?.userNumber && (
                          <p className="text-black ">
                            {contract.customer.userNumber}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {contract.order?.orderNumber && (
                          <p className="text-black ">
                            {contract.order.orderNumber}
                          </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {contract.deposit && (
                          <p className="text-black ">{contract.deposit} </p>
                        )}
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {contract.totalPrice && (
                          <p className="text-black ">{contract.totalPrice} </p>
                        )}
                      </td>

                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <button
                          onClick={() =>
                            navigate("/truckdetail/" + contract.id)
                          }
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

export default TransportationContract;
