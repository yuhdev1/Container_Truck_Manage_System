package vn.fpt.edu.ctms.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.response.ContainerTruckResponse;
import vn.fpt.edu.ctms.dto.response.EditContainerTruckResponse;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.service.ContainerTruckService;
import vn.fpt.edu.ctms.util.DateUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;

@RestController
@RequestMapping("/api/containertruck")
@RequiredArgsConstructor
@Slf4j
public class ContainerTruckController {

    private final ContainerTruckService containerTruckService;

    private final ModelMapper modelMapper;
    private final DateUtils dateUtils;

    @GetMapping("")
    public ResponseEntity<HashMap<String, Object>> getContainerTrucksByCriteria(
            @RequestParam(required = false, name = "truck_id") String truckId,
            @RequestParam(required = false, name = "license_plate") String licensePlate,
            @RequestParam(required = false, name = "manufacturer") String manufacturer,
            @RequestParam(required = false, name = "capacity") Float capacity,
            @RequestParam(required = false, name = "is_active") Boolean isActive,
            @RequestParam(required = false, name = "full_name") String fullName,
            @RequestParam(required = false, name = "user_number") String userNumber,
            @RequestParam(required = false, name = "inUse") Boolean inUse,
            @RequestParam(required = false, name = "registration_date") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate registrationDate,
            @RequestParam(required = false, name = "container_status") String containerStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int pageSize) {
        log.info("Calling api getContainerTrucksByCriteria/ fullName: {} ", fullName);
        return ResponseEntity.ok(containerTruckService.
                getContainerTruckByCriteria(truckId, licensePlate, manufacturer,
                        capacity, isActive, fullName, registrationDate,inUse,userNumber,containerStatus,
                        page, pageSize));
    }

    @PostMapping("add")
    public ResponseEntity<?> createContainerTruck(@RequestPart("addContainerTruckRequest") ContainerTruckDTO addContainerTruckRequest,
                                                  @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api containerTruck/ request: {} ", addContainerTruckRequest);
        try {
            var containerTruck = modelMapper.map(addContainerTruckRequest, ContainerTruck.class);
            var added = containerTruckService.addContainerTruck(containerTruck, file);
            return new ResponseEntity<>(added.values(), HttpStatusCode.valueOf(added.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error creating containertruck:", e);
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editContainerTruck(@RequestPart("editContainerRequest") ContainerTruckDTO editContainerRequest,
                                                @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api editContainerTruck/ request: {} ", editContainerRequest);
        try {
            var containerTruck = modelMapper.map(editContainerRequest, ContainerTruck.class);
            var editContainerTruck = containerTruckService.editContainerTruck(containerTruck, file);
            log.info("Edit success truckId : {} ", containerTruck.getTruckId());
            var editResp = modelMapper.map(editContainerRequest, EditContainerTruckResponse.class);
            return ResponseEntity.status(HttpStatusCode.valueOf(editContainerTruck.keySet().iterator().next())).body(editResp);
        } catch (Exception e) {
            log.error("Error creating user:", e);
            return ResponseEntity.badRequest().body("Error creating containertruck: " + e.getMessage());
        }
    }
    @GetMapping("/{driverId}")
    public ResponseEntity<?> getContainerByDriver(@PathVariable String driverId){
        log.info("Calling api getContainerByDriver with driverId: {}", driverId);
        try {
            var truck = containerTruckService.findTruckByDriver(driverId);
            var truckResp = modelMapper.map(truck, ContainerTruckResponse.class);
            return ResponseEntity.status(HttpStatus.OK).body(truckResp);
        } catch (Exception e) {
            log.error("Error getContainerByDriver:", e);
            return ResponseEntity.badRequest().body("Error getContainerByDriver:" + e.getMessage());
        }
    }

    @PutMapping("/{truckId}")
    public ResponseEntity<?> changeActiveContainerTruck(@PathVariable String truckId) {
        log.info("Calling api deactiveContainerTruck with userId: {}", truckId);
        try {
            containerTruckService.changeActiveContainerTruck(truckId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deactive containertruck:", e);
            return ResponseEntity.badRequest().body("Error deactive containertruck: " + e.getMessage());
        }
    }

    @GetMapping("/notInUse")
    public ResponseEntity<?> getTruckNotInUse() {
        log.info("Calling api getTruckNotInUse with userId");
        return ResponseEntity.ok(containerTruckService.findAllByInUse());
    }

    @PutMapping("/{truckId}/driver/{driverId}")
    public ResponseEntity<?> editContainerTruckAndDriver(@PathVariable String truckId,@PathVariable String driverId){
        log.info("Calling api editContainerTruckAndDriver");
        try {
            containerTruckService.editContainerTruckWithDriver(truckId,driverId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deactive containertruck:", e);
            return ResponseEntity.badRequest().body("Error update driver to containertruck: " + e.getMessage());
        }
    }


}
