package vn.fpt.edu.ctms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerTruckDTO {
    String truckId;
    String licensePlate;
    String manufacturer;
    Float capacity;
    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    LocalDate registrationDate;
    Boolean isActive;
    String containerStatus;
    String attach;
    Boolean inUse;

}