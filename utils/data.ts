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
    { name: "Thuộc nhóm", uid: "categoryName" },
    { name: "Phân loại", uid: "typeName" },
    { name: "Nhà sản xuất", uid: "manufacturerName" },
    { name: "Giá nhập", uid: "inboundPrice" },
    { name: "Giá bán", uid: "sellPrice" },
    { name: "Số lượng toàn hệ thống", uid: "unitConversions" },
    { name: "Trạng thái", uid: "status" },
    { name: "Tác vụ", uid: "actions" },
];

export const inboundColumns = [
    { name: "STT", uid: "no." },
    { name: "Mã phiếu nhập", uid: "inboundCode" },
    { name: "Nhập hàng từ", uid: "supplierName" },
    { name: "Kiểu nhập hàng", uid: "inboundType" },
    { name: "Người tạo", uid: "createdBy" },
    { name: "Trạng thái", uid: "status" },
    { name: "Tổng tiền", uid: "totalPrice" },
    { name: "Ngày tạo", uid: "createdDate" },
    { name: "Tác vụ", uid: "actions" },
];

export const outboundColumns = [
    { name: "STT", uid: "no." },
    { name: "Mã phiếu nhập", uid: "outboundCode" },
    { name: "Xuất hàng cho", uid: "outboundName" },
    { name: "Kiểu xuất hàng", uid: "outboundType" },
    { name: "Người tạo", uid: "createdBy" },
    { name: "Trạng thái", uid: "status" },
    { name: "Tổng tiền", uid: "totalPrice" },
    { name: "Ngày tạo", uid: "createdDate" },
    { name: "Tác vụ", uid: "actions" },
];

export const batchColumns = [
    { name: "STT", uid: "no." },
    { name: "Mã lô", uid: "batchCode" },
    { name: "Ngày sản xuất", uid: "produceDate" },
    { name: "Ngày hết hạn", uid: "expireDate" },
    { name: "Giá nhập", uid: "inboundPrice" },
    { name: "Số lượng toàn hệ thống", uid: "quantity" },
    { name: "Tác vụ", uid: "actions" },
];

export const inventoryCheckColumns = [
    { name: "STT", uid: "no." },
    { name: "Mã phiếu kiểm", uid: "inventoryCheckCode" },
    { name: "Người tạo", uid: "createdBy" },
    { name: "Trạng thái", uid: "status" },
    { name: "Ngày tạo", uid: "createdDate" },
    { name: "Tác vụ", uid: "actions" },
];

export const inventoryCheckColumnsTwo = [
    { name: "STT", uid: "no." },
    { name: "Thuộc nhóm", uid: "categoryName" },
    { name: "Tên sản phẩm", uid: "productName" },
    { name: "Mã lô", uid: "batchCode" },
    { name: "Số lượng", uid: "quantity" },
    { name: "Đơn vị", uid: "baseUnit" },
    { name: "Giá gốc", uid: "inboundPrice" },
    { name: "Giá bán", uid: "sellPrice" },
    { name: "Nhà sản xuất", uid: "manufacturerName" },
    { name: "Ngày hết hạn", uid: "expireDate" },
];

export const StorageLocationColumns = [
    { name: "STT", uid: "no." },
    { name: "Mã vị trí lưu trữ", uid: "code" },
    { name: "Loại vị trí lưu trữ", uid: "type" },
    { name: "Khu vực", uid: "zone" },
    { name: "Lối đi", uid: "aisle" },
    { name: "Số hàng", uid: "row" },
    { name: "Cấp kệ", uid: "level" },
    { name: "Trạng thái hoạt động", uid: "active" },
    { name: "Tác vụ", uid: "actions" },
];

export const InventoryReportColumns = [
    { name: "STT", uid: "index" },
    { name: "Hình ảnh", uid: "image" },
    { name: "Mã sản phẩm", uid: "registrationCode" },
    { name: "Tên sản phẩm", uid: "productName" },
    { name: "Định mức dưới", uid: "minQuantity" },
    { name: "Định mức trên", uid: "maxQuantity" },
    { name: "Tồn kho", uid: "totalQuantity" },
    { name: "Có thể bán", uid: "sellableQuantity" },
    { name: "Vị trí lưu trữ", uid: "storageLocation" },
    { name: "Xem lô sản phẩm", uid: "actions" },
];

export const InventoryBatchReportColumns = [
    { name: "STT", uid: "index" },
    { name: "Mã lô", uid: "batchCode" },
    { name: "Ngày hết hạn", uid: "expireDate" },
    { name: "Số lượng tồn kho", uid: "totalQuantity" },
];
