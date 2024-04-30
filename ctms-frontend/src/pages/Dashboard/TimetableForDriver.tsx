import React, { useState, useEffect } from "react";
import { addWeeks, format, startOfWeek, endOfWeek, addDays } from "date-fns";
import axios from "axios";
import { user } from "../../model/user";
import { workday } from "../../model/workday";
import useAxiosAuth from "../../libs/hook/useAxiosAuth";
import useAuth from "../../libs/hook/useAuth";
const TimetableForDriver = () => {
  const axios = useAxiosAuth();
  const [nextSevenDays, setNextSevenDays] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<user[]>([]);
  const [workday, setWorkday] = useState<workday[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const { userId } = useAuth();

  const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeek = parseInt(event.target.value, 10);
    setSelectedWeek(selectedWeek);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startOfThisWeek = startOfWeek(addWeeks(new Date(), selectedWeek));
        const nextDays = Array.from({ length: 7 }, (_, index) => {
          const nextDay = addDays(startOfThisWeek, index);
          return format(nextDay, "yyyy-MM-dd");
        });
        setNextSevenDays(nextDays);

        const driver = await axios.get("http://localhost:8099/api/user", {
          params: {
            role: "DRIVER",
            userId: userId ? userId : "",
          },
        });
        setDrivers(driver.data.content);

        const workday1 = await axios.get("http://localhost:8099/api/schedule");
        setWorkday(workday1.data.content);
      } catch (error) {}
    };

    fetchData();
  }, [selectedWeek]);

  return (
    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-8 rounded-t-sm bg-primary text-black">
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> 2024 </span>
              <span className="block lg:hidden"> Mon </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Monday </span>
              <span className="block lg:hidden"> Mon </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Tuesday </span>
              <span className="block lg:hidden"> Tue </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Wednesday </span>
              <span className="block lg:hidden"> Wed </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Thursday </span>
              <span className="block lg:hidden"> Thu </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Friday </span>
              <span className="block lg:hidden"> Fri </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Saturday </span>
              <span className="block lg:hidden"> Sat </span>
            </th>
            <th className="flex h-15 items-center justify-center rounded-tl-sm p-1 text-xs font-semibold sm:text-base xl:p-5">
              <span className="hidden lg:block"> Sunday </span>
              <span className="block lg:hidden"> Sun </span>
            </th>
          </tr>
          <tr className="grid grid-cols-8 rounded-t-sm bg-primary text-black">
            <th>
              <select value={selectedWeek} onChange={handleWeekChange}>
                {[...Array(52)].map((_, index) => {
                  const weekStart = startOfWeek(addWeeks(new Date(), index));
                  const weekEnd = endOfWeek(addWeeks(new Date(), index));
                  const weekLabel = `${format(weekStart, "dd/MM")} - ${format(
                    weekEnd,
                    "dd/MM"
                  )}`;

                  return (
                    <option key={index} value={index}>
                      {weekLabel}
                    </option>
                  );
                })}
              </select>
            </th>
            {nextSevenDays.map((day, index) => (
              <th key={index}>{day.slice(5, 10)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver, driverIndex) => (
            <tr className="grid grid-cols-8" key={driverIndex}>
              <td className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31">
                <span className="font-medium text-black dark:text-white">
                  {driver.firstName} {driver.lastName}
                </span>
              </td>
              {nextSevenDays.map((day, dayIndex) => {
                const driverWorkday = workday.find(
                  (item) =>
                    item.containerTruck.driver?.userId === driver.userId &&
                    item.to >= day &&
                    item.from <= day
                );
                console.log(day);
                return (
                  <td
                    className="ease relative h-20 cursor-pointer border border-stroke p-2 transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:h-25 md:p-6 xl:h-31"
                    key={dayIndex}
                  >
                    <span className="font-medium text-black dark:text-white">
                      {driverWorkday ? (
                        <div className="event invisible absolute left-0 z-99 mb-1 flex w-[100%] flex-col rounded-sm border-l-[3px] border-primary bg-gray px-3 py-1 text-left opacity-0 group-hover:visible group-hover:opacity-100 dark:bg-meta-4 md:visible md:w-[100%] md:opacity-100">
                          <span className="event-name text-sm font-semibold text-black dark:text-white">
                            Có lịch
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableForDriver;
