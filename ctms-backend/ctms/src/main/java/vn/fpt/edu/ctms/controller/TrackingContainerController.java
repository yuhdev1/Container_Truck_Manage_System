package vn.fpt.edu.ctms.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.TrackingContainer;
import vn.fpt.edu.ctms.service.TrackingContainerService;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@Slf4j
public class TrackingContainerController
{
    private final TrackingContainerService trackingContainerService;


    @GetMapping("")
    public ResponseEntity<?> getTrackingContainerByOrderId(@RequestParam String orderId) {
        log.info("Calling api getTrackingContainerByOrderId/ request: {} ", orderId);
        TrackingContainer trackingContainer = trackingContainerService.findTrackingContainerOrderId(orderId);
        return ResponseEntity.ok(trackingContainer);
    }


    @PutMapping("")
    public ResponseEntity<?> checkPoint(@RequestParam String orderId, @RequestParam String location) {
        log.info("Calling API to check point for order: {}", orderId);

        try {
            trackingContainerService.checkPoint(orderId, location);
            return ResponseEntity.ok("Location checked successfully for order: " + orderId);

        } catch (ValidationExc e) {
            return ResponseEntity.badRequest().body("All 3 locations have been checked for order: " + orderId);
        }

    }


}
