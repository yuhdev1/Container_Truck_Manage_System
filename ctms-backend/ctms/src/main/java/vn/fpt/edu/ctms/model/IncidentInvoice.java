package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "incident_invoice")
public class IncidentInvoice {
    @Id
    @Column(name = "incident_invoice_id")
    private String incidentInvoiceId;

    @OneToOne
    @JoinColumn(name = "orders", referencedColumnName = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "driver", referencedColumnName = "user_id")
    private User driver;

    private String description;

    @Column(name = "payment_method")
    private String paymentMethod;

    private Float tax;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "cost")
    private Float cost;

    private String attach;

    @PrePersist
    public void generateId() {
        this.incidentInvoiceId = UUID.randomUUID().toString();
    }
}
