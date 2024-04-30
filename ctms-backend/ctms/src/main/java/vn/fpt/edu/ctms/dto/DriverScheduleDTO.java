package vn.fpt.edu.ctms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.User;

import java.sql.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverScheduleDTO {

    private String id;
    private User driver;
    private ContainerTruck containerTruck;
    private Date from;
    private Date to;
    private String orderId;
    private String truckId;
    private String driverId;
    private String orderNumber;
    private String customerNumber;
    private String driverNumber;
    private String licensePlate;
    private String timeStamp;
}
