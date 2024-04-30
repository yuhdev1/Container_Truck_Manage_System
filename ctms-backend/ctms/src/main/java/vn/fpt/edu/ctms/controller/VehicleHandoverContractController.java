package vn.fpt.edu.ctms.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.dto.VehicleHanoverContractDTO;
import vn.fpt.edu.ctms.dto.request.VehicleHandoverContractRequest;
import vn.fpt.edu.ctms.model.VehicleHandoverContract;
import vn.fpt.edu.ctms.service.VehicleHandoverContractService;

import java.util.HashMap;

@RestController
@RequestMapping("/api/contract/vehicalhandover")
@RequiredArgsConstructor
@Slf4j
public class VehicleHandoverContractController {
    private final VehicleHandoverContractService vehicleHandoverContractService;
    private final ModelMapper modelMapper;
    @GetMapping("")
    public ResponseEntity<HashMap<String, Object>> getVehicalHandoverContractByCriteria(
            VehicleHanoverContractDTO vehicleHanoverContractDTO,
            ContainerTruckDTO containerTruckDTO,
            UserDTO userDtO,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int pageSize

    ) {
        log.info("Calling api getVehicalHandoverContractByCriteria / VehicalHanoverContractDTO: {} ,ContainerTruckDTO {}  ", vehicleHanoverContractDTO, containerTruckDTO);
        return ResponseEntity.ok(vehicleHandoverContractService.getVehicalHandoverContractByCriteria(vehicleHanoverContractDTO, containerTruckDTO, userDtO, page, pageSize));
    }


    @PostMapping("add")
    public ResponseEntity<?> createVehicalHandoverContract(@RequestPart("vehicleHandoverContractRequest") VehicleHandoverContractRequest vehicleHandoverContractRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api createVehicalHandoverContract/ request: {} ", vehicleHandoverContractRequest.getVehicleHanoverContractDTO());
        try {
            var contract = modelMapper.map(vehicleHandoverContractRequest.getVehicleHanoverContractDTO(), VehicleHandoverContract.class);
            var added = vehicleHandoverContractService.addVehicalHandoverContract(contract,
                    vehicleHandoverContractRequest.getTruckId(), vehicleHandoverContractRequest.getUserId(), file);
            log.info("Added success : {} ", added);
            return new ResponseEntity<>(added.values(), HttpStatusCode.valueOf(added.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error creating RepairInvoice:", e);
            return ResponseEntity.badRequest().body("Lỗi tạo mới hợp đồng: " + e.getMessage());
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editVehicalHandoverContract(@RequestPart("vehicleHandoverContractRequest") VehicleHandoverContractRequest vehicleHandoverContractRequest, @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api editVehicalHandoverContract/ request: {} ", vehicleHandoverContractRequest);
        try {
            var contract = modelMapper.map(vehicleHandoverContractRequest.getVehicleHanoverContractDTO(), VehicleHandoverContract.class);
            var edited = vehicleHandoverContractService.editVehicleHandoverContract(contract,vehicleHandoverContractRequest.getTruckId(),vehicleHandoverContractRequest.getUserId(), file);
            return new ResponseEntity<>(edited.values(), HttpStatusCode.valueOf(edited.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error updating:", e);
            return ResponseEntity.badRequest().body("Lỗi sửa chữa hợp đồng !: " + e.getMessage());
        }
    }
}
