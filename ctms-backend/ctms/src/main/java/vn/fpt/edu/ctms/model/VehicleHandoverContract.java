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
@Table(name = "vehicle_handover_contract")

public class VehicleHandoverContract {
    @Id

    @Column(name = "id")
    private String handingContractId;

    @ManyToOne
    @JoinColumn(name = "driver", referencedColumnName = "user_id")
    private User driver;

    @ManyToOne
    @JoinColumn(name = "container_truck", referencedColumnName = "truck_id")
    private ContainerTruck truck;

    @Column(name = "contract_number")
    private String contractNumber;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private Float salary;

    private String note;

    private String attach;

    @PrePersist
    public void generateId() {
        this.handingContractId = UUID.randomUUID().toString();
    }
}
