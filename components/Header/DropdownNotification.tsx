import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import ClickOutside from "@/components/ClickOutside";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { TokenDecoded } from "@/types/tokenDecoded";
import { getAllNotifications, getQuantityUnreadNoti, markAsRead } from "@/services/notificationServices";
import { Notification } from "@/types/notification";
import { formatDateTimeDDMMYYYYHHMM } from "@/utils/methods";

const DropdownNotification = () => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifying, setNotifying] = useState(true);
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [quantityUnread, setQuantityUnread] = useState<number>(0);

    const getAllNotificationsByUserId = async () => {
        try {
            const response = await getAllNotifications(userInfo!.id.toString(), sessionToken);

            if (response) {
                setNotifications(response);
                if (response.some((noti: Notification) => noti.read === false)) setNotifying(true);
                else setNotifying(false);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getQuantityUnread = async () => {
            try {
                const response = await getQuantityUnreadNoti(userInfo!.id.toString(), sessionToken);

                if (response) {
                    setQuantityUnread(response);
                }
            } catch (error: any) {
                console.log(error);
            }
        };

        getAllNotificationsByUserId();
        getQuantityUnread();
    }, []);

    useEffect(() => {
        // Kết nối tới SSE API
        const eventSource = new EventSource(
            `https://warehouse.longtam.store/dsd/api/v1/staff/notification/${userInfo!.id}/stream`
            // `localhost:8081/dsd/api/v1/staff/notification/${userInfo!.id}/stream`
        );

        // Lắng nghe sự kiện "message" từ server
        eventSource.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            // Hiển thị thông báo bằng React Toastify
            toast.info(data.notification.message);

            // Gọi API để đồng bộ danh sách thông báo
            await getAllNotifications(userInfo!.id.toString(), sessionToken);
        };

        // Xử lý lỗi nếu xảy ra
        eventSource.onerror = (error) => {
            console.error("SSE error:", error);
            eventSource.close();
        };

        // Dọn dẹp kết nối SSE khi component bị hủy
        return () => {
            eventSource.close();
        };
    }, []);

    const handleClickNoti = async (notiId: string, notiType: string) => {
        try {
            await markAsRead(userInfo!.id.toString(), notiId, sessionToken);
            await getAllNotificationsByUserId();

            if (["CANH_BAO_SAN_PHAM", "DUOI_DINH_MUC", "VUOT_DINH_MUC", "HET_HAN", "GAN_HET_HAN"].includes(notiType))
                router.push("/inventory-check");
            else if (["YEU_CAU_DUYET_DON_NHAP", "NHAP_PHIEU_NHAP_VAO_HE_THONG"].includes(notiType))
                router.push("/inbound/list");
            else if (["YEU_CAU_DUYET_DON_XUAT", "NHAP_PHIEU_XUAT_VAO_HE_THONG"].includes(notiType))
                router.push("/outbound/list");
            else if (["YEU_CAU_DUYET_DON_KIEM", "NHAP_PHIEU_KIEM_VAO_HE_THONG"].includes(notiType))
                router.push("/inventory-check-note/list");
            else if (notiType === "YEU_CAU_DANG_KY_TAI_KHOAN") router.push("/users/request");
            else if (notiType === "GIA_SAN_PHAM_THAY_DOI") router.push("/products/list");
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
            <li>
                <Link
                    onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                    }}
                    href="#"
                    className="relative flex size-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                    <span
                        className={`absolute -top-0.5 right-0 z-1 size-2 rounded-full bg-meta-1 ${
                            notifying === false ? "hidden" : "inline"
                        }`}
                    >
                        <span className="absolute -z-1 inline-flex size-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                    </span>

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

                {dropdownOpen && (
                    <div
                        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default sm:right-0 sm:w-80 dark:border-strokedark dark:bg-boxdark`}
                    >
                        <div className="px-4.5 py-3">
                            <h5 className="text-sm font-medium text-bodydark2">
                                Thông báo <span className="text-danger">{`(${quantityUnread} Chưa đọc)`}</span>
                            </h5>
                        </div>

                        <ul className="flex h-auto flex-col overflow-y-auto">
                            {notifications.map((noti) => (
                                <li key={noti.id}>
                                    <Link
                                        className={`flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 ${noti.read === false ? "bg-gray hover:bg-strokedark/20" : ""}`}
                                        href="#"
                                        onClick={() =>
                                            handleClickNoti(noti.notification.id.toString(), noti.notification.notiType)
                                        }
                                    >
                                        <p className="text-sm">
                                            <span className="text-black dark:text-white">
                                                {noti.notification.notiName}
                                            </span>{" "}
                                            {noti.notification.message}
                                        </p>

                                        <p className="text-xs">{formatDateTimeDDMMYYYYHHMM(noti.createdDate)}</p>
                                    </Link>
                                </li>
                            ))}
                            {/* <li>
                                <Link
                                    className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                                    href="#"
                                >
                                    <p className="text-sm">
                                        <span className="text-black dark:text-white">
                                            Edit your information in a swipe
                                        </span>{" "}
                                        Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                                        anim.
                                    </p>

                                    <p className="text-xs">12 May, 2025</p>
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                )}
            </li>
        </ClickOutside>
    );
};

export default DropdownNotification;
