import CardUser from "../../components/CardUser";
import CardRevenue from "../../components/CardRevenue";
import CardOrder from "../../components/CardOrder";
import CardProfit from "../../components/CardProfit";
import ChartOne from "../../components/ChartOne";
import ChartThree from "../../components/ChartThree";
import ChartTwo from "../../components/ChartTwo";
import { DashboardInfoResponse } from "../../model/dashboard";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";

const ECommerce = () => {
  const httpClient = useAxiosAuth();
  const [generalData, setGeneralData] = useState<DashboardInfoResponse>();

  useEffect(() => {
    const generalData = fetchgeneralData();
    generalData.then((data) => {
      data && setGeneralData(data);
    });
  }, []);

  const fetchgeneralData = () =>
    httpClient
      .get<DashboardInfoResponse>("/api/dashboard/general")
      .then((res: AxiosResponse<DashboardInfoResponse>) => {
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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardRevenue
          revenue={
            generalData?.revenue === undefined ? 0 : generalData?.revenue
          }
        />
        <CardProfit
          profit={generalData?.expense === undefined ? 0 : generalData?.expense}
        />
        <CardOrder
          totalOrder={
            generalData?.totalOrder === undefined ? 0 : generalData?.totalOrder
          }
        />
        <CardUser
          totalUser={
            generalData?.totalUser === undefined ? 0 : generalData?.totalUser
          }
        />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        {/* <ChartTwo /> */}
        <ChartThree />
      </div>
    </>
  );
};

export default ECommerce;
