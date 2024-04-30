import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ChartTwoData } from "../model/dashboard";
import useAxiosAuth from "../libs/hook/useAxiosAuth";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import timezonedDayjs from "../libs/dayjstz";

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    type: "donut",
  },
  // colors: ["#10B981", "#375E83", "#259AE6", "#FFA70B"],
  colors: ["#375E83", "#259AE6", "#FFA70B"],
  labels: ["Thiệt hại", "Sửa chữa"],
  legend: {
    show: true,
    position: "bottom",
  },

  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
    style: {
      colors: ["#000000"],
    },
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 300,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const [state, setState] = useState<ChartThreeState>({
    series: [65, 34],
  });
  const [option, setOption] = useState(options);
  const httpClient = useAxiosAuth();
  const [generalData, setGeneralData] = useState<ChartTwoData>();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const data = fetchgeneralData();
    data.then((data) => {
      data && setGeneralData(data);
    });
  }, []);

  const fetchgeneralData = async () =>
    await httpClient
      .get<ChartTwoData>("/api/dashboard/chart/two")
      .then((res: AxiosResponse<ChartTwoData>) => {
        const data = res.data;
        if (
          data?.incidentExpense !== undefined &&
          data?.repairExpense !== undefined
        ) {
          console.log("settig");
          setState({
            series: [data.incidentExpense, data.repairExpense],
          });
          setTotal(data.repairExpense + data.incidentExpense);
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
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-2xl font-semibold text-primary dark:text-white">
            Chi phí
          </h5>
          <p className="text-sm text-black font-medium">
            {timezonedDayjs()
              .subtract(1, "year")
              .add(1, "month")
              .format("DD-MM-YYYY")}
            {" đến "}
            {timezonedDayjs().format("DD-MM-YYYY")}
          </p>
        </div>
      </div>

      <div className="mb-2 mt-9">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={state.series} type="pie" />
        </div>
      </div>

      <div className="-mx-8 mt-6 flex flex-wrap items-center justify-center gap-y-3">
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Thiệt hại </span>
              <span>
                {generalData?.incidentExpense &&
                  Math.round((generalData.incidentExpense / total) * 100)}
                %
              </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#6577F3]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Sửa chữa </span>
              <span>
                {generalData?.repairExpense &&
                  Math.round((generalData.repairExpense / total) * 100)}
                %
              </span>
            </p>
          </div>
        </div>
        {/* <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Mobile </span>
              <span> 45% </span>
            </p>
          </div>
        </div>
        <div className="w-full px-8 sm:w-1/2">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Unknown </span>
              <span> 12% </span>
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ChartThree;
