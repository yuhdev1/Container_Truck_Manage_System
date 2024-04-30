package vn.fpt.edu.ctms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private String id;
    private String customerId;
    private String orderId;
    private Boolean seen;
    private String  receiver;
}
