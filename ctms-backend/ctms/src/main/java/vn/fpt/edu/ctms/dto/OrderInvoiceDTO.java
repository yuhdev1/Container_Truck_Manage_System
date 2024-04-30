package vn.fpt.edu.ctms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;


import java.sql.Date;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderInvoiceDTO {
    private String orderInvoiceId;
    private OrderDTO order;
    private UserDTO customer;
    private Float shippingCost;
    private String invoiceNumber;
    private Float tax;
    private String paymentMethod;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate paymentDate;
    private String note;
    private String attach;
}
