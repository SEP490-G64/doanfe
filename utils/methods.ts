import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | undefined) => {
    if (!token) return true;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp) return decodedToken.exp < currentTime;
        throw new Error();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

export const formatDateTime = (date: Date | string | undefined) => {
    if (!date) return "";
    const newDate = new Date(date);

    // Lấy ngày, tháng và năm
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên cần cộng thêm 1
    const year = newDate.getFullYear();
    // Định dạng lại chuỗi
    return `${day}-${month}-${year}`;
};

export const formatDateTimeDDMMYYYY = (date: Date | string | undefined) => {
    if (!date) return "";
    const newDate = new Date(date);

    // Lấy ngày, tháng và năm
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên cần cộng thêm 1
    const year = newDate.getFullYear();
    // Định dạng lại chuỗi
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;
};

export const formatDateTimeYYYYMMDD = (date: Date | string | undefined) => {
    if (!date) return "";
    const newDate = new Date(date);

    // Lấy ngày, tháng và năm
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên cần cộng thêm 1
    const year = newDate.getFullYear();

    // Định dạng lại chuỗi với zero padding cho tháng và ngày
    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

export const formatDateTimeDDMMYYYYHHMM = (date: Date | string | undefined) => {
    if (!date) return "";
    const newDate = new Date(date);

    // Lấy ngày, tháng, năm, giờ, phút
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên cần cộng thêm 1
    const year = newDate.getFullYear();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    // Định dạng lại chuỗi
    return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year} ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export const formatLargeNumber = (num: number | undefined) => {
    if (num === undefined) {
        return "0";
    } else {
        let formattedNumber = "";
        if (num >= 1_000_000_000_000_000_000) {
            formattedNumber = (num / 1_000_000_000_000_000_000).toFixed(1); // Quinquaginta
            return parseFloat(formattedNumber).toLocaleString() + "Qi"; // Triệu Triệu Triệu Triệu (Quinquaginta)
        } else if (num >= 1_000_000_000_000_000) {
            formattedNumber = (num / 1_000_000_000_000_000).toFixed(1); // Quadrillion
            return parseFloat(formattedNumber).toLocaleString() + "Qa"; // Triệu Triệu Triệu (Quadrillion)
        } else if (num >= 1_000_000_000_000) {
            formattedNumber = (num / 1_000_000_000_000).toFixed(1); // Trillion
            return parseFloat(formattedNumber).toLocaleString() + "T"; // Triệu Tỷ (Trillion)
        } else if (num >= 1_000_000_000) {
            formattedNumber = (num / 1_000_000_000).toFixed(1); // Billion
            return parseFloat(formattedNumber).toLocaleString() + "B"; // Tỷ (Billion)
        } else if (num >= 1_000_000) {
            formattedNumber = (num / 1_000_000).toFixed(1); // Million
            return parseFloat(formattedNumber).toLocaleString() + "M"; // Triệu (Million)
        } else if (num >= 1_000) {
            formattedNumber = (num / 1_000).toFixed(1); // Thousand
            return parseFloat(formattedNumber).toLocaleString() + "K"; // Nghìn (Thousand)
        } else {
            return num ? num.toLocaleString() : "0"; // Nếu không phải số lớn, chỉ định dạng với dấu phẩy
        }
    }
};
