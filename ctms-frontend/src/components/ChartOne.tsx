import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import useAxiosAuth from "../libs/hook/useAxiosAuth";
import { ChartOneData } from "../model/dashboard";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import timezonedDayjs from "../libs/dayjstz";
import { ContainerTruckResponse } from "../model/container_truck";
import { ContainerTruck } from "../model/workday";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../libs/constant";

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },

  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    zoom: {
      enabled: false,
    },
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
      tools: {
        zoom: false,
      },
    },
  },

  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    show: false,
    min: 0,
    max: 100,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: "Product One",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },
    ],
  });
  const [option, setOption] = useState(options);
  const httpClient = useAxiosAuth();
  const [trucks, setTrucks] = useState<ContainerTruck[]>();
  const [truckFilter, setTrucksFilter] = useState("");
  useEffect(() => {
    const trucks = fetchTruckData();
    trucks.then((truck) => {
      truck && setTrucks(truck.containerTrucks);
    });
  }, []);

  const { data } = useQuery({
    queryKey: [QUERY_KEY.CHART_ONE, truckFilter],
    queryFn: () => fetchgeneralData(),
  });

  const fetchTruckData = async () =>
    await httpClient
      .get<ContainerTruckResponse>("/api/containertruck", {
        params: {
          pageSize: 1000,
          isActive: true,
        },
      })
      .then((res: AxiosResponse<ContainerTruckResponse>) => {
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

  const fetchgeneralData = async () =>
    await httpClient
      .get<ChartOneData>("/api/dashboard/chart/one", {
        params: {
          truckId: truckFilter,
        },
      })
      .then((res: AxiosResponse<ChartOneData>) => {
        const data = res.data;
        if (
          data?.data !== undefined &&
          data?.months !== undefined &&
          data?.max !== undefined
        ) {
          console.log("settig");
          setState({
            series: [
              {
                name: "Doanh thu",
                data: data.data.reverse(),
              },
            ],
          });
          setOption({
            ...option,
            xaxis: {
              categories: data.months.reverse(),
            },
            yaxis: {
              min: 0,
              max: data.max * 1.5,
              show: false,
              tickAmount: 5,
            },
          });
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
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full">
              <p className="font-semibold text-primary text-2xl">Doanh thu</p>
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
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <select
            name="#"
            id="#"
            value={truckFilter}
            onChange={(e) => {
              setTrucksFilter(e.target.value);
              // fetchgeneralData();
            }}
            className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
          >
            <option value="">All</option>
            {trucks &&
              trucks.length > 0 &&
              trucks.map((truck, index) => (
                <option key={index} value={truck.truckId}>
                  {truck.licensePlate}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={option}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
