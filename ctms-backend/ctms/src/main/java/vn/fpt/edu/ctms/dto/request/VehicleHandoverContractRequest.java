package vn.fpt.edu.ctms.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.VehicleHanoverContractDTO;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class VehicleHandoverContractRequest {
    private VehicleHanoverContractDTO vehicleHanoverContractDTO;
    private String truckId;
    private String userId;
}
