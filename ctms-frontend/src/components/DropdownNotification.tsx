import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Notification, NotificationResponse } from "../model/notification";
import useAuth from "../libs/hook/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Constant, { QUERY_KEY, ROLE } from "../libs/constant";
import useAxiosAuth from "../libs/hook/useAxiosAuth";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useSubscription } from "react-stomp-hooks";
import timezonedDayjs from "../libs/dayjstz";

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNew, setIsNew] = useState(false);
  const [socketUrl, setSocketUrl] = useState("");
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const { userNumber, role } = useAuth();
  const httpClient = useAxiosAuth();
  const navigate = useNavigate();
  useSubscription(socketUrl, (message) => {
    if (message && message.body) {
      setIsNew(true);
      const noti = JSON.parse(message.body);
      notifications.unshift(noti);
    }
  });

  useEffect(() => {
    if (role === ROLE.CUSTOMER) {
      setSocketUrl("/user/" + userNumber + "/");
    }
    if (role === ROLE.STAFF) {
      setSocketUrl("/user/staff/");
    }
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    checkNew();
    return () => document.removeEventListener("click", clickHandler);
  }, [notifications]);

  const { data, refetch } = useQuery({
    queryKey: [QUERY_KEY.NOTIFICATION],
    queryFn: () => fetchNotification(),
  });

  const fetchNotification = async () => {
    let receiverParam = "";
    if (role && role === ROLE.CUSTOMER) {
      receiverParam = userNumber;
    }
    if (role && role === ROLE.STAFF) {
      receiverParam = "staff";
    }
    return await httpClient
      .get("/api/notification", {
        params: {
          receiver: receiverParam,
          size: 5,
        },
      })
      .then((res: AxiosResponse<NotificationResponse>) => {
        res.data && setNotifications(res.data.content);
        checkNew();
        return res.data.content;
      })
      .catch((reason: AxiosError) => {
        if (reason.code === "ERR_NETWORK") {
          toast.error("Sever is temporary down!");
        } else {
          // Handle else
          toast.error("Something went wrong");
        }
      });
  };

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const checkNew = () => {
    if (notifications && notifications.length > 0) {
      const filtered = notifications.filter((item) => item.seen === false);
      console.log(filtered);
      if (filtered && filtered.length > 0) {
        setIsNew(true);
      } else setIsNew(false);
    }
  };
  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen);
    // setIsNew(false);
    // if (lastestNoti) {
    //   updateNotifications();
    // }
  };
  const handleNotiClick = (notiId: string, orderId: string) => {
    notiId &&
      updateNotifications(notiId).then((res) => {
        refetch.call(fetchNotification());
        setDropdownOpen(!dropdownOpen);
        if (role === ROLE.CUSTOMER) {
          navigate("/orders/" + orderId);
        }
        if (role === ROLE.STAFF) {
          navigate("neworder/" + orderId);
        }
      });
  };
  const updateNotifications = (notiId: string) =>
    httpClient.put("api/notification/" + notiId);
  return (
    <>
      <li className="relative">
        <Link
          ref={trigger}
          onClick={handleDropdownOpen}
          to="#"
          className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          {isNew && (
            <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
            </span>
          )}

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${
            dropdownOpen === true ? "block" : "hidden"
          }`}
        >
          <div className="px-4.5 py-3">
            <h5 className="text-sm font-medium text-bodydark2">Thông báo</h5>
          </div>

          <ul className="flex h-auto flex-col overflow-y-auto">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={(e) =>
                    handleNotiClick(
                      notification.id,
                      notification.order?.orderId
                    )
                  }
                >
                  <Link
                    className={`flex flex-col gap-2.5 border-t ${
                      notification.seen ? "bg-gray-2" : "bg-stroke"
                    } border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4`}
                    to="#"
                  >
                    <p className="text-sm">
                      <span className="text-black dark:text-white">
                        {notification.content}
                      </span>
                    </p>

                    <p className="text-xs">
                      {timezonedDayjs(notification.timestamp).format(
                        "DD-MM-YYYY HH:mm:ss"
                      )}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li onClick={(e) => setDropdownOpen(!dropdownOpen)}>
                <Link
                  className="flex flex-col gap-2.5 border-t bg-gray-2
                     border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  to="#"
                >
                  <div className="text-sm">
                    <span className="text-black dark:text-white">
                      Không có thông báo
                    </span>
                    <div className="text-xs">
                      {timezonedDayjs().format("DD-MM-YYYY HH:mm:ss")}
                    </div>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </li>
    </>
  );
};

export default DropdownNotification;
