package vn.fpt.edu.ctms.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentStatusResponse {
    private String message;
    private String status;
    private String data;
}
