package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "transportation_contract")
public class TransportationContract {
    @Id
    @Column(name = "transportation_contract_id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "customer", referencedColumnName = "user_id")
    private User customer;

    @Column(name = "contract_number")
    private String contractNumber;

    @ManyToOne
    @JoinColumn(name = "orders", referencedColumnName = "order_id")
    private Order order;

    @Column(name = "etd")
    private Date etd;

    @Column(name = "eta")
    private Date eta;

    @Column(name = "requested _delivery_date")
    private Date requestedDeliveryDate;

    @Column(name="delivery_address")
    private String deliveryAddress;


    @Column(name="shipping_address")
    private String shippingAddress;

    @Column(name="attach")
    private String attach;

    @Column(name = "deposit")
    private Long deposit;

    @Column(name = "total_price")
    private Long totalPrice;



    @Column(name = "note")
    private String note;

    @PrePersist
    public void generateId() {
        this.id = UUID.randomUUID().toString();
    }
}
