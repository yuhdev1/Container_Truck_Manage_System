package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;

import java.sql.Date;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairInvoiceResponse {
    private String repairInvoiceId;
    private ContainerTruckResponse truck;
    private LocalDate repairDate;
    private String description;
    private Float tax;
    private Float repairCost;
    private String paymentMethod;
    private String serviceProvider;
    private String serviceProviderContact;
    private String attach;
    private String invoiceNumber;
}
