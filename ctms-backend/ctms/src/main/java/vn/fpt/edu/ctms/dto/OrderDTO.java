package vn.fpt.edu.ctms.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.model.User;


import java.sql.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private String orderId;
    private User customer;
    private Date shippingDate;
    private Date realityDeliveryDate;
    private Date etd;
    private Date eta;
    private Date requestedDeliveryDate;
    private String status;
    private String deliveryAddress;
    private String shippingAddress;
    private String payment;
    private String customerId;
    private String orderNumber;
    private Boolean hasDetail;
    private Boolean hasSchedule;
    private String description;
    private String userNumber;
    private String fullName;
    private Boolean paid;
    private String phone;
    private Long price;
}
