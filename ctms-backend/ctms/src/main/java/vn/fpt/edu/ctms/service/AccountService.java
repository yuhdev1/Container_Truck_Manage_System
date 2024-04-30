package vn.fpt.edu.ctms.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.model.Account;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.repository.AccountRepository;
import vn.fpt.edu.ctms.specification.AccountSpecification;
import org.springframework.data.domain.Page;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@AllArgsConstructor
public class AccountService {
    @Autowired
    private final AccountRepository accountRepository;

    @Autowired
    private final EmailService emailService;

    @Autowired
    private final UserService userService;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Transactional()
    public Account createAccount(String userId) {


        User user = userService.findbyUserId(userId);
        if (user == null || user.getEmail() == null) {
            throw new RuntimeException("User or user email not found.");
        }

        Optional<Account> existingAccount = accountRepository.findOneByUser_UserId(userId);
        if (existingAccount.isPresent()) {
            throw new RuntimeException("This user already has an account.");
        }

        String username = user.getEmail().substring(0, user.getEmail().indexOf('@'));

        String password = generatePassword();

        Account account = Account.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role(user.getRole())
                .isActive(true)
                .user(user)
                .build();

        accountRepository.save(account);

        user.setHasAccount(true);
        CompletableFuture.runAsync(() -> emailService.sendSimpleMessage(user.getEmail(), username, password,user.getUserNumber()));
//        emailService.sendSimpleMessage(user.getEmail(), username, password);

        return account;


    }


    public static String generatePassword() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        return uuid.substring(0, 8);
    }


    @Transactional(readOnly = true)
    public Page<Account> getAccountByCriteria(Account account, String userId, Pageable pageable) {
        Specification<Account> spec = AccountSpecification.filterByAllFields(account, userId);
        return accountRepository.findAll(spec, pageable);
    }


    @Transactional
    public void changeAccountStatus(String accountId) {
        Optional<Account> account = accountRepository.findById(accountId);

        account.ifPresent(acc -> {
            acc.setIsActive(!acc.getIsActive());
            accountRepository.save(acc);
        });
    }

}
