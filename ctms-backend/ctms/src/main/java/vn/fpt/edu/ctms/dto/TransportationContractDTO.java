package vn.fpt.edu.ctms.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.User;

import java.sql.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TransportationContractDTO {

    private String contractId;
    private String contractNumber;
    private User customer;
    private Order order;
    private Date etd;
    private Date eta;
    private Date requestedDeliveryDate;
    private String deliveryAddress;
    private String shippingAddress;
    private String note;
    private String attach;
    private String customerId;
    private Long deposit;
    private String userNumber;
    private String orderNumber;
    private Long totalPrice;

}
