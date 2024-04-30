package vn.fpt.edu.ctms.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.OrderInvoiceDTO;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderInvoiceRequest {
    private OrderInvoiceDTO orderInvoiceDTO;
    private String orderId;
    private String customerId;
}
