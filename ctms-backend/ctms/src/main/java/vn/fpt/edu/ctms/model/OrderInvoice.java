package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "order_invoice")
public class OrderInvoice {
    @Id
    @Column(name = "order_invoice_id")
    private String orderInvoiceId;
    @ManyToOne
    @JoinColumn(name = "orders", referencedColumnName = "order_id")
    private Order order;
    @ManyToOne
    @JoinColumn(name = "customer", referencedColumnName = "user_id")
    private User customer;

    @Column(name = "shipping_cost")
    private Float shippingCost;

    private Float tax;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    private String note;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    private String attach;

    @PrePersist
    public void generateId() {
        this.orderInvoiceId = UUID.randomUUID().toString();
    }
}
