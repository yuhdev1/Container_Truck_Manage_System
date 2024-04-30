package vn.fpt.edu.ctms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.UserDTO;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EditContainerTruckResponse {
    ContainerTruckDTO containerTruckRequest;
    UserDTO userRequest;
}
