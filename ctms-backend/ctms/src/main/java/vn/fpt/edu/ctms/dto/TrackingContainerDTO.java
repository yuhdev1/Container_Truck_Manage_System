package vn.fpt.edu.ctms.dto;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.Order;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingContainerDTO {

    private Order order;

    private ContainerTruck containerTruck;

    private String origin;

    private String destination;

    private float distance;

    private String firstLocation;

    private String secondLocation;

    private String thirdLocation;

    private String expectedPathImg;

    private String realPathImg;

    private String orderId;

    private String truckId;

    private String driverId;
}
