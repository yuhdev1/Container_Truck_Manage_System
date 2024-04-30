package vn.fpt.edu.ctms.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.AccountDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.Account;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.repository.AccountRepository;
import vn.fpt.edu.ctms.service.AccountService;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
@Slf4j
public class AccountController {
    @Autowired
    private final AccountService accountService;

    @Autowired
    private ModelMapper modelMapper;


    @PostMapping("/{userId}")
    public ResponseEntity<?> createAccount(@PathVariable String userId) {
        try {
            log.info("Calling api createAccount/ request: {}", userId);

            accountService.createAccount(userId);
            String successMessage = "Account created successfully for user: " + userId;
            return ResponseEntity.ok(successMessage);
        } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
    }
    }

    @GetMapping("")
    public ResponseEntity<Page<Account>> getAccountsByCriteria(AccountDTO accountCriteria,@RequestParam(required = false) String userId , Pageable pageable) {
        log.info("Calling api getUserByCriteria/ request: {} ", accountCriteria);
        User user=new User();
        user.setUserId(userId);
        accountCriteria.setUser(user);
        Account account = modelMapper.map(accountCriteria, Account.class);
        Page<Account> usersPage = accountService.getAccountByCriteria(account,userId, pageable);
        return ResponseEntity.ok(usersPage);
    }


//    @DeleteMapping("/{accountId}")
//    public ResponseEntity<?> changeStatusAccount(@PathVariable String accountId) {
//        log.info("Calling api changeStatusAccount with accountId: {}", accountId);
//        try {
//            accountService.changeAccountStatus(accountId);
//            return ResponseEntity.noContent().build();
//        } catch (Exception e) {
//            log.error("Error change status account:", e);
//            return ResponseEntity.badRequest().body("EError change status account: " + e.getMessage());
//        }
//    }



}
