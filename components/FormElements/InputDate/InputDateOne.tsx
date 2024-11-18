"use client";
import React, { useState } from "react";

const InputDateOne = ({
                          setDataSearch,
                          dataSearch,
                          dataKey,
                      }: {
    setDataSearch: (data: any) => void;
    dataSearch: any;
    dataKey: string;
}) => {
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(!!dataSearch[dataKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Chuyển đổi giá trị ngày (YYYY-MM-DD) thành LocalDateTime string với thời gian là 00:00:00.000
        const localDateTimeString = value
            ? new Date(value).toISOString().slice(0, 23) // Lấy phần ngày và giờ, bỏ ký tự Z
            : ""; // Nếu không có giá trị, trả về chuỗi rỗng

        setDataSearch({
            ...dataSearch,
            [dataKey]: localDateTimeString, // Lưu giá trị dưới dạng LocalDateTime string
        });
        setIsOptionSelected(!!value);
    };

    // Chuyển đổi giá trị LocalDateTime string thành định dạng YYYY-MM-DD để hiển thị trong input
    const displayValue = dataSearch[dataKey] ? dataSearch[dataKey].split('T')[0] : "";

    return (
        <div className="w-full">
            <div className="relative z-20 w-full">
                <input
                    type="date"
                    value={displayValue} // Hiển thị giá trị dưới dạng YYYY-MM-DD
                    onChange={handleChange}
                    className={`w-full h-full appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition 
                        ${isOptionSelected ? "text-black dark:text-white" : "text-gray-500"} 
                        focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                    style={{ minHeight: "40px" }}
                />
            </div>
        </div>
    );
};

export default InputDateOne;
