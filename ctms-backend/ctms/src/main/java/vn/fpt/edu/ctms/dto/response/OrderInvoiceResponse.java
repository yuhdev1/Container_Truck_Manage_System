package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.UserDTO;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderInvoiceResponse {
    private String orderInvoiceId;
    private OrderDTO order;
    private UserDTO customer;
    private Float shippingCost;
    private Float tax;
    private String paymentMethod;
    private LocalDate paymentDate;
    private String invoiceNumber;
    private String note;
    private String attach;
}
