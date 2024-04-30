package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.UserDTO;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentInvoiceResponse {
    private String incidentInvoiceId;
    private OrderDTO order;
    private UserDTO driver;
    private Float tax;
    private String description;
    private String invoiceNumber;
    private Float cost;
    private String paymentMethod;
    private LocalDate paymentDate;
    private String attach;
}
