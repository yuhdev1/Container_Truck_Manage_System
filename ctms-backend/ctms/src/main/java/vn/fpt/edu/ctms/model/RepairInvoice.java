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
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "repair_invoice")
public class RepairInvoice {
    @Id
    @Column(name = "repair_invoice_id")
    private String repairInvoiceId;
    @ManyToOne
    @JoinColumn(name = "truck", referencedColumnName = "truck_id")
    private ContainerTruck truck;

    @Column(name = "repair_date")
    private LocalDate repairDate;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    private String description;

    @Column(name = "repair_cost")
    private Float repairCost;

    private Float tax;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "service_provider")
    private String serviceProvider;


    @Column(name = "service_provider_contact")
    private String serviceProviderContact;

    private String attach;

    @PrePersist
    public void generateId() {
        this.repairInvoiceId = UUID.randomUUID().toString();
    }
}
