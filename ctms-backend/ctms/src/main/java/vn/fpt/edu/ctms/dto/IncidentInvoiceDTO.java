package vn.fpt.edu.ctms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class IncidentInvoiceDTO {
    private String incidentInvoiceId;
    private OrderDTO order;
    private UserDTO driver;
    private String description;
    private String paymentMethod;
    private Float tax;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate paymentDate;
    private Float cost;
    private String invoiceNumber;
    private String attach;
}
