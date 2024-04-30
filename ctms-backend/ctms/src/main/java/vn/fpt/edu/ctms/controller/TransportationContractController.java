package vn.fpt.edu.ctms.controller;

import com.amazonaws.services.kms.model.NotFoundException;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.dto.TransportationContractDTO;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.TransportationContract;
import vn.fpt.edu.ctms.service.TransportationContractService;

@RestController
@RequestMapping("/api/contract/transportation")
@RequiredArgsConstructor
@Slf4j
public class TransportationContractController {


    @Autowired
    TransportationContractService purchaseContractService;


    @GetMapping("")
    public ResponseEntity<Page<TransportationContract>> getTransportationContractByCriteria(TransportationContractDTO Criteria, Pageable pageable) {
        log.info("Calling api getTransportationContractByCriteria/ request: {} ", Criteria);
        Page<TransportationContract> purchaseContractPage = purchaseContractService.getPurchaseContractByCriteria(Criteria, pageable);
        return ResponseEntity.ok(purchaseContractPage);
    }


    @PostMapping("")
    public ResponseEntity<?> createTransportationContract(@RequestPart("transportationContract") @Nullable   TransportationContractDTO request,
                                                          @RequestPart("file")@Nullable MultipartFile file){

        log.info("Calling api createTransportationContract/ request: {} ", request);
        try {
            var contract =  purchaseContractService.createTransportationContract(request,file);
            return ResponseEntity.status(HttpStatus.CREATED).body(contract);
        } catch (Exception e) {
            log.error("Error  create Transportation Contract:", e);
            return ResponseEntity.badRequest().body("Error  create Transportation Contract: " + e.getMessage());
        }

    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransportationContract(@PathVariable String id,
                                                          @RequestPart("transportationContract") @Nullable TransportationContractDTO request,
                                                          @RequestPart("file")@Nullable MultipartFile file) {
        log.info("Calling api update TransportationContract");
        try {
            TransportationContract updateTransportationContract = purchaseContractService.updateTransportationContract(id, request,file);
            return ResponseEntity.ok(updateTransportationContract);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating order: " + e.getMessage());
        }
    }


//    @PostMapping("/{id}")
//    public ResponseEntity<?> changeStatus(@PathVariable String id) {
//        log.info("Calling api change transportation contract status with id: {}", id);
//        try {
//            purchaseContractService.changeStatus(id);
//            return ResponseEntity.noContent().build();
//        } catch (Exception e) {
//            log.error("Error change transportation contract status:", e);
//            return ResponseEntity.badRequest().body("Error change transportation contract status: " + e.getMessage());
//        }
//    }
//


}
