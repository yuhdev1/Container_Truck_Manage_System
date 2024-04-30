package vn.fpt.edu.ctms.util.helper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;


@Slf4j
@RequiredArgsConstructor
public class ExcelHelper {

    public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public static String[] HEADER_FOR_REPAIR = {"Biển số xe", "Ngày sửa chữa", "Số hóa đơn", "Mô tả", "Chi phí", "Thuế",
            "Phương thức \n" + "thanh toán", "Nhà cung cấp \n" +
            "dịch vụ", "Thông tin nhà cung \n" +
            "cấp dịch vụ", "Tệp đính kèm"};
    public static String[] HEADER_FOR_INCIDENT = {"Tên tài xế", "Mã đơn hàng", "Số hóa đơn ", "Phương thức\n" +
            " thanh toán ", "Chi phí", "Thuế", "Ngày thanh\n" +
            " toán", "Mô tả", "Tệp đính kèm"};
    public static String[] HEADER_FOR_ORDER = {"Tên khách hàng", "Mã đơn hàng", "Số hóa đơn ", "Phương thức\n" +
            " thanh toán ", "Chi phí", "Thuế", "Ngày thanh\n" +
            " toán", "Mô tả", "Tệp đính kèm"};
    public static String SHEET_FOR_REPAIR = "Hóa đơn sửa chữa";
    public static String SHEET_FOR_INCIDENT = "Hóa đơn sự cố";
    public static String SHEET_FOR_ORDER = "Hóa đơn đơn hàng";
    public static String FILE_NAME_FOR_REPAIR = "hoadonsuachua_";
    public static String FILE_NAME_FOR_INCIDENT = "hoasdownsuco_";
    public static String FILE_NAME_FOR_ORDER = "hoadonvanchuyen_";

    public static Boolean hasExcelFormat(MultipartFile file) {
        return TYPE.equals(file.getContentType());
    }


}
