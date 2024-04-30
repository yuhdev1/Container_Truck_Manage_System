package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tracking_container")
public class TrackingContainer {
    @Id
    @Column(name = "tracking_id")
    private String trackingId;

    @ManyToOne
    @JoinColumn(name = "orders", referencedColumnName = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "containerTruck", referencedColumnName = "truck_id")
    private ContainerTruck containerTruck;

    @Column(name = "origin")
    private String origin;

    @Column(name = "destination")
    private String destination;

    @Column(name = "distance")
    private float distance;

    @Column(name = "first_location")
    private String firstLocation;

    @Column(name = "second_location")
    private String secondLocation;

    @Column(name = "third_location")
    private String thirdLocation;

    @Column(name = "destination_location")
    private String destinationLocation;

    @Column(name = "expected_path_img")
    private String expectedPathImg;

    @Column(name = "real_path_img")
    private String realPathImg;
    @PrePersist
    public void generateId() {
        this.trackingId = UUID.randomUUID().toString();
    }
}
