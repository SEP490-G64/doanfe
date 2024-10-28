export const branchColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên chi nhánh", uid: "branchName" },
    { name: "Địa chỉ", uid: "location" },
    { name: "Số điện thoại", uid: "phoneNumber" },
    { name: "Trạng thái", uid: "activeStatus" },
    { name: "Tác vụ", uid: "actions" },
];

export const categoryColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên nhóm sản phẩm", uid: "categoryName" },
    { name: "Mô tả", uid: "categoryDescription" },
    { name: "% thuế nhập", uid: "taxRate" },
    { name: "Tác vụ", uid: "actions" },
];

export const typeColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên loại sản phẩm", uid: "typeName" },
    { name: "Mô tả", uid: "typeDescription" },
    { name: "Tác vụ", uid: "actions" },
];

export const supplierColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên nhà sản xuất", uid: "supplierName" },
    { name: "Địa chỉ", uid: "address" },
    { name: "Số điện thoại", uid: "phoneNumber" },
    { name: "Trạng thái", uid: "status" },
    { name: "Tác vụ", uid: "actions" },
];

export const manufacturerColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên nhà sản xuất", uid: "manufacturerName" },
    { name: "Nguồn gốc", uid: "origin" },
    { name: "Trạng thái", uid: "status" },
    { name: "Tác vụ", uid: "actions" },
];

export const userColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên người dùng", uid: "userName" },
    { name: "Email", uid: "email" },
    { name: "Chi nhánh làm việc", uid: "branch" },
    { name: "Vai Trò", uid: "roles" },
    { name: "Trạng thái", uid: "status" },
    { name: "Tác vụ", uid: "actions" },
];

export const unitColumns = [
    { name: "STT", uid: "no." },
    { name: "Tên đơn vị", uid: "unitName" },
    { name: "Tác vụ", uid: "actions" },
];

export const productColumns = [
    { name: "STT", uid: "no." },
    { name: "Hình ảnh", uid: "urlImage" },
    { name: "Tên sản phẩm", uid: "productName" },
    { name: "Mã đăng ký", uid: "registrationCode" },
    { name: "Giá nhập", uid: "inboundPrice" },
    { name: "Giá bán", uid: "sellPrice" },
    { name: "Trạng thái", uid: "status" },
    { name: "Số lượng tối thiểu", uid: "minQuantity" },
    { name: "Số lượng tối đa", uid: "maxQuantity" },
    { name: "Tác vụ", uid: "actions" },
];

export const allowProductColumns = [
    { name: "Mã đăng ký", uid: "registrationCode" },
    { name: "Tên sản phẩm", uid: "productName" },
    { name: "Tác vụ", uid: "actions" },
];
