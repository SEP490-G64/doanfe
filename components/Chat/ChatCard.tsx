import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";
import z from "zod";
import { formatLargeNumber } from "@/utils/methods";

interface Supplier {
    id: string,
    supplierName: string,
    address: string,
    quantity: number,
    value: number
}

interface ChatCardProps {
    data: Supplier[] | undefined; // Ensure data can be undefined
}

const ChatCard: React.FC<ChatCardProps> = ({ data }) => {
    // Check if data is defined and is an array
    if (!data || !Array.isArray(data)) {
        return <div className="text-center p-4">Không có nhà cung cấp nào tồn tại</div>;
    }

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default xl:col-span-4 dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
                Top nhà cung cấp giao dịch nhiều nhất
            </h4>

            <div>
                {data.map((supplier, key) => (
                    <Link
                        href="/"
                        className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
                        key={key}
                    >
                        <div className="flex flex-1 items-center justify-between">
                            <div>
                                <h5 className="font-medium text-black dark:text-white">{supplier.supplierName}</h5>
                                <p className="text-sm text-black dark:text-white">{supplier.address}</p>
                                <p className="text-xs text-meta-5"> {supplier.quantity} đơn giao dịch</p>
                                <p className="text-sm"> Tổng giá trị nhập - xuất: <span className="text-meta-3">{formatLargeNumber(supplier.value)}đ</span></p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ChatCard;
