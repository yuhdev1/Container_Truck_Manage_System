package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.UUID;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "driver_schedule")
public class DriverSchedule {
    @Id
    @Column(name = "id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "containerTruck", referencedColumnName = "truck_id")
    private ContainerTruck containerTruck;

    @ManyToOne
    @JoinColumn(name = "orders", referencedColumnName = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "driver", referencedColumnName = "user_id")
    private User driver;


    @Column(name = "time_from")
    private Date from;

    @Column(name = "time_to")
    private Date to;

    @Column(name = "transportation_code")
    private String transportationCode;


    @Column(name = "time_stamp")
    private String time_stamp;

    @PrePersist
    public void generateId() {
        this.id = UUID.randomUUID().toString();
    }
}
