import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const uploadFile = async (formData: FormData, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/file/save", formData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Upload ảnh thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Bạn chưa đăng nhập");
        else {
            toast.error("Có lỗi xảy ra");
            console.log(error);
        }
    }
};
