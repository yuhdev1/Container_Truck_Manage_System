package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "salary")
@Builder
public class Salary {
    @Id
    @Column(name = "salary_id")
    private String salaryId;

    @ManyToOne
    @JoinColumn(name = "user", referencedColumnName = "user_id")
    private User user;

    @Column(name = "fixed_salary")
    private float fixedSalary;

    @Column(name = "fix_cost")
    private int fixCost;

    @Column(name = "bonus_salary")
    private float bonusSalary;

    private String note;
    @PrePersist
    public void generateId() {
        this.salaryId = UUID.randomUUID().toString();
    }
}
