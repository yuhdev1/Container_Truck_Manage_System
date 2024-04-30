package vn.fpt.edu.ctms.controller;


import com.amazonaws.services.kms.model.NotFoundException;
import com.azure.core.annotation.Put;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.NotificationDTO;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.Notification;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("")
    public ResponseEntity<?> getNotificationByCriteria(NotificationDTO criteria, Pageable pageable) {
        log.info("Calling api getNotificationByCriteria/ request: ");
        Page<Notification> usersPage = notificationService.getNotificationByCriteria(criteria,pageable);
        return ResponseEntity.ok(usersPage);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotification(@PathVariable String id) {
        try {
            Notification notification = notificationService.updateNotification(id);
            return ResponseEntity.ok(notification);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating notification: " + e.getMessage());
        }
    }

}
