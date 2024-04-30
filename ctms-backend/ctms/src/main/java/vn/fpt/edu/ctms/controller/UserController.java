package vn.fpt.edu.ctms.controller;

import com.amazonaws.services.kms.model.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.ValidationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.service.UserService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    private final ModelMapper modelMapper;


    @GetMapping("")
    public ResponseEntity<Page<User>> getUsersByCriteria(UserDTO criteria, Pageable pageable) {
        log.info("Calling api getUserByCriteria/ request: {} ", criteria);
        Page<User> usersPage = userService.getUsersByCriteria(criteria, pageable);
        return ResponseEntity.ok(usersPage);
    }

    @PostMapping("")
    public ResponseEntity<?> createUser(@RequestBody UserDTO userRequest) {

        log.info("Calling api createUser/ request: {} ", userRequest);
        try {
            User createdUser = userService.createUser(userRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            log.error("Error creating user:", e);
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }

    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> DeactiveUser(@PathVariable String userId) {
        log.info("Calling api deleteUser with userId: {}", userId);
        try {
            userService.deactivateUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting user:", e);
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        log.info("Calling api deleteUser with userId: {}", userId);
        try {
           User user= userService.findbyUserId(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error deleting user:", e);
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable String userId, @RequestBody UserDTO updatedUserData) {
        try {
            User updatedUser = userService.updateUser(userId, updatedUserData);
            return ResponseEntity.ok(updatedUser);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user: " + e.getMessage());
        }
    }


}