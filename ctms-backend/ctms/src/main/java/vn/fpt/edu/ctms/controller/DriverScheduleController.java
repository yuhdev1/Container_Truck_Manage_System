package vn.fpt.edu.ctms.controller;

import com.amazonaws.services.kms.model.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.DriverScheduleDTO;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.DriverSchedule;
import vn.fpt.edu.ctms.service.DriverScheduleService;

import java.sql.Driver;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Slf4j
public class DriverScheduleController {

    @Autowired
    private DriverScheduleService driverScheduleService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("")
    public ResponseEntity<Page<DriverSchedule>> getDriverScheduleByCriteria(DriverScheduleDTO driverScheduleDTO, Pageable pageable) {
        log.info("Calling api getDriverScheduleByCriteria/ request: {} ", driverScheduleDTO);
        Page<DriverSchedule> usersPage = driverScheduleService.getDriverScheduleByCriteria(driverScheduleDTO ,pageable);
        return ResponseEntity.ok(usersPage);
    }

    @PostMapping("")
    public ResponseEntity<?> coordination(@RequestParam String orderId, @RequestParam String truckId) {
        log.info("Calling api coordination/ request:");
        try {
            DriverSchedule assignOrder = driverScheduleService.transportCoordination(orderId, truckId);
            return ResponseEntity.status(HttpStatus.CREATED).body(assignOrder);
        } catch (Exception e) {
            log.error("Error creating order:", e);
            return ResponseEntity.badRequest().body("Error coordination: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDriverSchedule(@PathVariable String id,@RequestBody DriverScheduleDTO driverScheduleDTO) {
        log.info("Calling api updateDriverSchedule with id: {}", id);
        try {
           DriverSchedule driverSchedule = driverScheduleService.updateDriverSchedule(id,driverScheduleDTO);
            return ResponseEntity.ok(driverSchedule);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating contract: " + e.getMessage());
        }
    }


    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> test(@PathVariable String orderId,
                                  @RequestParam(required = false) String licensePlate,
                                  @RequestParam(required = false) String userNumber,
                                  @RequestParam(required = false) String fullName
            ,Pageable pageable) {
        log.info("Calling api updateDriverSchedule with id: {}", orderId);
        try {
            Page<ContainerTruck> driverSchedule = driverScheduleService.findTruckNotWorkingByOrderId(orderId,licensePlate,userNumber,fullName,pageable);
            return ResponseEntity.ok(driverSchedule);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating contract: " + e.getMessage());
        }
    }




}

