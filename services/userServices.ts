/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserBodyType } from "@/lib/schemaValidate/userSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/user";
import translate from "translate";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getListUser = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
    const params: Params = {
        page,
        size,
    };

    for (const searchKey in dataSearch) {
        if (dataSearch[searchKey as keyof typeof dataSearch]) {
            params[searchKey as keyof typeof params] = dataSearch[searchKey as keyof typeof dataSearch];
        }
    }

    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getUserById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};
export const createUser = async (User: UserBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/admin/user", User, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(User);

        if (res.data) {
            toast.success("Tạo mới người dùng thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.user.exist")) {
                toast.error("Người dùng đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới người dùng thất bại");
            console.log(error);
        }
    }
};

export const updateUser = async (User: UserBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/admin/user/${id}`, User, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(User);

        if (res.data) {
            toast.success("Cập nhật người dùng thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.user.exist")) {
                toast.error("Người dùng đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật người dùng thất bại");
            console.log(error);
        }
    }
};

export const deleteUser = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa người dùng thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa người dùng thất bại");
            console.log(error);
        }
    }
};

export const activateUser = async (id: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/admin/user/activate/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.data) {
            if (res.data.status === "ACTIVATE") {
                toast.success("Kích hoạt người dùng thành công");
            } else {
                toast.success("Vô hiệu hóa người dùng thành công");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Kích hoạt / Vô hiệu hóa người dùng thất bại");
            console.log(error);
        }
    }
};

export const getRegistrationRequests = async (page: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user/registration-requests`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page },
        });

        console.log(res);
        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const approveUser = async (id: string, accept: boolean, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/admin/user/verify-user/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { accept },
            }
        );

        if (res.data) {
            if (accept) {
                toast.success("Duyệt người dùng thành công");
            } else {
                toast.success("Từ chối người dùng thành công");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            if (accept) {
                toast.error("Duyệt người dùng thất bại");
            } else {
                toast.error("Từ chối người dùng thất bại");
            }
            console.log(error);
        }
    }
};

// Dịch message
const translateText = async (text: string, targetLanguage: string) => {
    try {
        translate.engine = "google"; // Sử dụng Google Translate engine
        translate.key = process.env.GOOGLE_API_KEY; // Nếu có key Google API

        const translatedText = await translate(text, { to: targetLanguage });
        return translatedText; // Trả về chuỗi đã dịch
    } catch (error) {
        console.error("Error translating text:", error);
        return text; // Nếu có lỗi dịch, trả về text gốc
    }
};

export const importUser = async (file: FormData, token: string) => {
    try {
        const res = await httpRequest.post(`dsd/api/v1/admin/user/excel/import`, file, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (res) {
            // Kiểm tra nếu message chứa thông báo thành công
            if (res.message?.includes("The Excel file is uploaded successfully")) {
                toast.success("Import danh sách người dùng thành công");
                return res.data; // Trả về dữ liệu nếu thành công
            }
        }
    } catch (error: any) {
        if (error.response?.data?.errors && error.response?.data?.errors.length > 0) {
            // Hiển thị các lỗi từ server, dịch chúng và thêm từng lỗi vào danh sách
            const errors = error.response.data.errors;
            for (const err of errors) {
                const translatedError = await translateText(err, "vi");
                toast.error(translatedError); // Liệt kê từng lỗi đã dịch
            }
        } else {
            // Nếu không có lỗi chi tiết, hiển thị thông báo lỗi chung
            toast.error("Import danh sách người dùng thất bại");
        }

        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const exportUser = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user/excel/export`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        });

        if (res) {
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};
