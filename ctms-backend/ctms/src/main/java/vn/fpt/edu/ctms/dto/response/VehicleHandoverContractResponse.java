package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.UserDTO;

import java.sql.Date;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class VehicleHandoverContractResponse {
    private String handingContractId;
    private UserDTO driver;
    private ContainerTruckDTO truck;
    private String contractNumber;
    private LocalDate startDate;
    private LocalDate endDate;
    private Float salary;
    private String note;
    private String attach;
}