package vn.fpt.edu.ctms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "order_detail")
public class OrderDetail {
    @Id
    private String Id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "order_id")
    @JsonIgnore
    private Order order;

    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "cubic_meter")
    private Integer cubicMeter;

    @Column(name="metric_ton")
    private Integer metricTon;

    @Column(name="kilogram")
    private Integer kilogram;


    @PrePersist
    public void generateId() {
        this.Id = UUID.randomUUID().toString();
    }


}