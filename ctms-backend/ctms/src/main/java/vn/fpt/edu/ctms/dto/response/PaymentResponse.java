package vn.fpt.edu.ctms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.io.Serializable;

@Data
@Builder
public class PaymentResponse implements Serializable {
    private String status;
    private String message;
    private String url;
}
