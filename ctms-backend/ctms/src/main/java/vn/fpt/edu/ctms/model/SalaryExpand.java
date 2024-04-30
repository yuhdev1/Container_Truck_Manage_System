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
@Table(name = "salary_expand")
public class SalaryExpand {
    @Id
    @Column(name = "salary_expand_id")
    private String salaryExpandId;

    @ManyToOne
    @JoinColumn(name = "salary", referencedColumnName = "salary_id")
    private Salary salary;

    @Column(name = "cost_name")
    private String costName;

    private float cost;

    @ManyToOne
    @JoinColumn(name = "repair_invoice", referencedColumnName = "repair_invoice_id")
    private RepairInvoice repairInvoice;

    private String note;

    private Date date;
    @PrePersist
    public void generateId() {
        this.salaryExpandId = UUID.randomUUID().toString();
    }
}
