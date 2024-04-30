package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "container_truck")
@Entity
@Builder
public class ContainerTruck {
    @Id
    @Column(name = "truck_id")
    private String truckId;

    @Column(name = "license_plate")
    private String licensePlate;

    private String manufacturer;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    private Float capacity;

    @Column(name = "is_active")
    private Boolean isActive;

    private String attach;
    @Column(name="container_status")
    @Enumerated(EnumType.STRING)
    private ContainerStatus containerStatus;

    @Column(name = "in_use")
    private Boolean inUse;
    @OneToOne
    @JoinColumn(name = "driver", referencedColumnName = "user_id")
    private User driver;


    @PrePersist
    public void generateTruckId() {
        this.truckId = UUID.randomUUID().toString();
    }
}
