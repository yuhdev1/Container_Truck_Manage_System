package vn.fpt.edu.ctms.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.ContainerStatus;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerTruckResponse {
    //@JsonProperty("truck_id")
    private String truckId;
    //@JsonProperty("license_plate")
    private String licensePlate;
    //@JsonProperty("manufacturer")
    private String manufacturer;
    //@JsonProperty("capacity")
    private Float capacity;
    //@JsonProperty("is_active")
    private Boolean isActive;
    private String attach;
    private String containerStatus;
    private LocalDate registrationDate;
    private String orderId;
    //@JsonProperty("driver")
    private UserDTO driver;
}
