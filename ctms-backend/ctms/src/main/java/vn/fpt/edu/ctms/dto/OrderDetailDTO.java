package vn.fpt.edu.ctms.dto;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.OrderType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailDTO {
    private Order order;
    private String orderType;
    private Integer quantity;
    private Integer cubicMeter;
    private Integer kilogram;
}
