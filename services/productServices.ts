/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductBodyType } from "@/lib/schemaValidate/productSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/product";
import translate from "translate";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getListProduct = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/product`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getListProductByCheckQuantity = async (
    page: string,
    size: string,
    lessThanOrEqual: boolean,
    quantity: number,
    warning: boolean,
    outOfStock: boolean,
    token: string
) => {
    const params: Params = {
        page,
        size,
    };

    try {
        const res = await httpRequest.get(
            `dsd/api/v1/staff/product/filter?lessThanOrEqual=${lessThanOrEqual}&quantity=${quantity}&warning=${warning}&outOfStock=${outOfStock}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params,
            }
        );

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getListProductByCheckNonePrice = async (page: string, size: string, price: number, token: string) => {
    const params: Params = {
        page,
        size,
    };

    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/sell-price?price=${price}`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getListProductByCheckPrice = async (page: string, size: string, token: string) => {
    const params: Params = {
        page,
        size,
    };

    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/loss-price`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getListProductByCheckNumberOfExpiredDate = async (
    page: string,
    size: string,
    numberOfDate: number,
    token: string
) => {
    const params: Params = {
        page,
        size,
    };

    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/batch/expired-batch-days?days=${numberOfDate}`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getListProductByCheckExpiredDate = async (page: string, size: string, token: string) => {
    const params: Params = {
        page,
        size,
    };

    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/batch/expired-batch`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductBySupplierId = async (supplierId: string, keyword: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/products-by-supplier/${supplierId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductByBranchId = async (
    branchId: string,
    keyword: string,
    checkValid: boolean,
    token: string,
    supplierId?: string,
    withSellprice?: boolean
) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/branchProducts/${branchId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword, checkValid, supplierId, withSellprice },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductInventoryCheck = async (branchId: string, token: string) => {
    try {
        const res = await httpRequest.get(`/dsd/api/v1/staff/product/products-inventory-check/${branchId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductInventoryCheckByType = async (branchId: string, token: string, typeId: string) => {
    try {
        const res = await httpRequest.get(
            `/dsd/api/v1/staff/product/products-inventory-check/${branchId}/type/${typeId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductInventoryCheckByCate = async (branchId: string, token: string, categoryId?: string) => {
    try {
        const res = await httpRequest.get(
            `/dsd/api/v1/staff/product/products-inventory-check/${branchId}/category/${categoryId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getAllowedProducts = async (keyword: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/allow-products`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

function toVietnamISOString() {
    const now = new Date();
    const vietnamOffset = 7 * 60 * 60 * 1000; // 7 giờ (ms)
    const vietnamTime = new Date(now.getTime() + vietnamOffset);

    return vietnamTime.toISOString();
}

export const getProductsChangedHistory = async (startDate: string | Date, productId: number, token: string) => {
    try {
        const endDate = toVietnamISOString();

        const res = await httpRequest.get(
            // `dsd/api/v1/staff/product/${productId}/audit-history?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59`,
            // `dsd/api/v1/staff/product/1/audit-history?startDate=${startDate}&endDate=2024-12-31T23:59:59`,
            `dsd/api/v1/staff/product/${productId}/audit-history?startDate=${startDate}&endDate=${endDate.slice(0, -1)}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const createProduct = async (product: ProductBodyType, token: string) => {
    try {
        console.log(product);
        const res = await httpRequest.post("dsd/api/v1/staff/product", product, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới sản phẩm thất bại");
            console.log(error);
        }
    }
};

export const updateProduct = async (product: ProductBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/product/${id}`, product, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật sản phẩm thất bại");
            console.log(error);
        }
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa sản phẩm thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa sản phẩm thất bại");
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

export const importProduct = async (file: FormData, token: string) => {
    try {
        const res = await httpRequest.post(`dsd/api/v1/staff/product/excel/import`, file, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        if (res) {
            // Kiểm tra nếu message chứa thông báo thành công
            if (res.message?.includes("The Excel file is uploaded successfully")) {
                toast.success("Import danh sách sản phẩm thành công");
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
            toast.error("Import danh sách sản phẩm thất bại");
        }

        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const exportProduct = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/excel/export`, {
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

export const searchAllProductsByKeyword = async (keyword: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/get-by-keyword`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};
