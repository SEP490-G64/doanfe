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

export const formatDateTimeYYYYMMDD = (date: Date | string | undefined) => {
    if (!date) return "";
    const newDate = new Date(date);

    // Lấy ngày, tháng và năm
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1; // getMonth() trả về giá trị từ 0-11, nên cần cộng thêm 1
    const year = newDate.getFullYear();
    // Định dạng lại chuỗi
    return `${year}-${month}-${day < 10 ? `0${day}` : day}`;
};
