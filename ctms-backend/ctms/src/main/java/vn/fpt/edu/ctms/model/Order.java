package vn.fpt.edu.ctms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @Column(name = "order_id")
    private String orderId;

    @ManyToOne
    @JoinColumn(name = "customer", referencedColumnName = "user_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "containerTruck", referencedColumnName = "truck_id")
    private ContainerTruck containerTruck;


    @Column(name="shipping date")
    private Date shippingDate;

    @Column(name = "etd")
    private Date etd;

    @Column(name = "eta")
    private Date eta;

    @Column(name = "requested _delivery_date")
    private Date requestedDeliveryDate;

    @Column(name = "reality_delivery_date")
    private Date realityDeliveryDate;

    @Enumerated(EnumType.STRING)
    private Payment payment;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "orderNumber")
    private String orderNumber;

    @Column(name = "description")
    private String description;


    @Column(name="delivery_address")
    private String deliveryAddress;


    @Column(name="shipping_address")
    private String shippingAddress;

    @Column(name="price")
    private Long price;

    @Column(name = "paid")
    private Boolean paid;


    @PrePersist
    public void generateId() {
        this.orderId = UUID.randomUUID().toString();
    }


}
