package vn.fpt.edu.ctms.controller;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.service.EmailService;

@RestController
@RequiredArgsConstructor
@Slf4j
public class EmailController {
    @Autowired
    private final EmailService emailService;


//    public ResponseEntity<?> sendEmail(String userID) {
//
//        try {
//            log.info("Calling api sendEmail: {} ", userID);
//
//        } catch (Exception e) {
//            log.error("Error send email:", e);
//            return ResponseEntity.badRequest().body("Error send email: " + e.getMessage());
//        }
//
//    }

}
