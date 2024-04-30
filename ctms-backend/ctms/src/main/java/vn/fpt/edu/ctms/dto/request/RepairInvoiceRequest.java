package vn.fpt.edu.ctms.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.dto.RepairInvoiceDTO;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RepairInvoiceRequest {
    private RepairInvoiceDTO repairInvoiceDTO;
    private String truckId;
}
