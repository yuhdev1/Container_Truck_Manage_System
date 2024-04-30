package vn.fpt.edu.ctms.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.IncidentInvoiceDTO;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class IncidentInvoiceRequest {
    private IncidentInvoiceDTO incidentInvoiceDTO;
    private String orderId;
    private String driverId;
}
