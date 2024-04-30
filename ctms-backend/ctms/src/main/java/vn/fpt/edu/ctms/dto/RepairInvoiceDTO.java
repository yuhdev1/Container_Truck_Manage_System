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
public class RepairInvoiceDTO {

    private String repairInvoiceId;
    private ContainerTruckDTO truck;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate repairDate;
    private String description;
    private Float repairCost;
    private String paymentMethod;
    private String serviceProvider;
    private String serviceProviderContact;
    private Float tax;
    private String attach;
    private String invoiceNumber;

}
