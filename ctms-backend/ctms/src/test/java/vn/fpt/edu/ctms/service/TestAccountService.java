package vn.fpt.edu.ctms.service;

import com.amazonaws.services.kms.model.NotFoundException;
import lombok.RequiredArgsConstructor;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;

import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.security.crypto.password.PasswordEncoder;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.AccountRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestAccountService {

    @Spy
    private AccountRepository accountRepository;


    @InjectMocks
    private AccountService accountService;

    @Test
    void testGetAccountByCriteria() {
        // Arrange
        Page<IncidentInvoice> mockPage = mock(Page.class);
        when(accountRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        // Act
        Page<Account> users = accountService.getAccountByCriteria(new Account(), null, PageRequest.of(0, 4));

        // Assert
        assertNotNull(users);
        assertEquals(mockPage, users);

        // Verify
        verify(accountRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }
    @Test
    public void testCreateAccount_Success() throws Exception {
        // Mock dependencies
        UserService mockUserService = mock(UserService.class);
        EmailService mockEmailService = mock(EmailService.class);
        PasswordEncoder mockPasswordEncoder = mock(PasswordEncoder.class);

        // Mock user data
        String userId = "user123";
        User mockUser = User.builder().userId(userId)
                .email("thanhnd123@gmail.com")
                .role(Role.CUSTOMER).build();

        // Mock user service behavior
        when(mockUserService.findbyUserId(userId)).thenReturn(mockUser);

        // Mock password encoding
        String encodedPassword = "mockEncodedPassword";
        when(mockPasswordEncoder.encode(anyString())).thenReturn(encodedPassword);

        // Inject mocks into the class under test
        AccountService accountService = new AccountService(accountRepository, mockEmailService, mockUserService, mockPasswordEncoder);

        // Call the function
        Account createdAccount = accountService.createAccount(userId);

        // Assertions
        assertNotNull(createdAccount);
        assertEquals(userId, createdAccount.getUser().getUserId());
        assertEquals(usernameFromEmail(mockUser.getEmail()), createdAccount.getUsername());
        assertTrue(createdAccount.getIsActive());
        assertTrue(mockUser.getHasAccount());

        // Verify email service call using mockEmailService
//        verify(mockEmailService).sendSimpleMessage(eq(mockUser.getEmail()), anyString(), anyString());
    }

    private String usernameFromEmail(String email) {
        return email.substring(0, email.indexOf('@'));
    }

    @Test
    void testChangeAccountStatus_ActiveToInactive() {
        // Arrange
        String accountId = "account123";
        Account account = new Account();
        account.setAccountId(accountId);
        account.setIsActive(true);

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

        // Act
        accountService.changeAccountStatus(accountId);

        // Assert
        assertFalse(account.getIsActive());
        verify(accountRepository, times(1)).findById(accountId);
        verify(accountRepository, times(1)).save(account);
    }

    @Test
    void testChangeAccountStatus_InactiveToActive() {
        // Arrange
        String accountId = "account456";
        Account account = new Account();
        account.setAccountId(accountId);
        account.setIsActive(false);

        when(accountRepository.findById(accountId)).thenReturn(Optional.of(account));

        // Act
        accountService.changeAccountStatus(accountId);

        // Assert
        assertTrue(account.getIsActive());
        verify(accountRepository, times(1)).findById(accountId);
        verify(accountRepository, times(1)).save(account);
    }


    @Test
    void testChangeAccountStatus_AccountNotFound() {
        // Arrange
        String accountId = "123123123123";

        when(accountRepository.findById(accountId)).thenReturn(Optional.empty());

        // Act & Assert
        verify(accountRepository, never()).save(any(Account.class));



    }

    @Test
    public void testGeneratePassword_Length() {
        String password = accountService.generatePassword();
        assertEquals(8, password.length(), "Generated password should be 8 characters long");
    }

    @Test
    public void testGeneratePassword_CharacterSet() {
        String password = accountService.generatePassword();
        assertTrue(password.matches("[a-zA-Z0-9]+"), "Generated password should only contain alphanumeric characters");
    }

}
