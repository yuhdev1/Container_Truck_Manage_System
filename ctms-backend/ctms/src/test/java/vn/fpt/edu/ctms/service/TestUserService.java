package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
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
import vn.fpt.edu.ctms.dto.*;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.AccountRepository;
import vn.fpt.edu.ctms.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestUserService {

    @Spy
    private UserRepository userRepository;

    @Spy
    private AccountRepository accountRepository;
    @InjectMocks
    private UserService userService;


    @Test
    void testGetUsersByCriteria() {
        // Arrange
        Page<IncidentInvoice> mockPage = mock(Page.class);
        when(userRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        // Act
        Page<User> users = userService.getUsersByCriteria(new UserDTO(), PageRequest.of(0, 4));

        // Assert
        assertNotNull(users);
        assertEquals(mockPage, users);

        // Verify
        verify(userRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }


    @Test
    void testFindbyUserId_WhenUserExists_ExpectUserReturned() {
        // Arrange
        String userId = "1";
        User expectedUser = User.builder().userId(userId).build();
        when(userRepository.findByUserId(userId)).thenReturn(Optional.of(expectedUser));

        // Act
        User resultUser = userService.findbyUserId(userId);

        // Assert
        assertNotNull(resultUser);
        assertEquals(expectedUser, resultUser);
    }

    @Test
    void testFindbyUserId_WhenUserNotExists_ExpectExceptionThrown() {
        // Arrange
        String userId = "2";
        when(userRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundExc.class, () -> userService.findbyUserId(userId));
    }

    @Test
    void testCreateUser() {
        // Arrange
        UserDTO userRequest = new UserDTO();
        userRequest.setFirstName("John");
        userRequest.setLastName("Doe");
        userRequest.setRole("CUSTOMER");
        userRequest.setPhone("0972973936");
        userRequest.setEmail("thanhnd@gmail.com");
        userRequest.setBirthDate("12-12-2002");
        userRequest.setPersonalId("124567890000");
        // other necessary fields setup

        User user = new User(); // You need to initialize user object with necessary fields

        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        userService.createUser(userRequest);

        // Assert
        verify(userRepository, times(1)).save(any(User.class));
        // Add more verifications if necessary for other service method calls
    }

    @Test
    void testDeactivateUser() {
        // Arrange
        String userId = "user123";
        User user = new User();
        user.setUserId(userId);
        user.setIsActive(true);

        Account account = new Account();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(accountRepository.findOneByUser_UserId(userId)).thenReturn(Optional.of(account));

        // Act
        userService.deactivateUser(userId);

        // Assert
        verify(userRepository, times(1)).findById(userId); // Verify that findById method is called once with userId
        assertTrue(!user.getIsActive());
        verify(userRepository, times(1)).save(user); // Verify that the save method is called once with updated user
    }

    @Test
    void testUpdateUser() {
        // Arrange
        String userId = "user123";
        UserDTO updatedUserData = new UserDTO();
        updatedUserData.setFirstName("John");
        updatedUserData.setLastName("Doe");
        updatedUserData.setPhone("0972973936");

        User existingUser = new User();
        existingUser.setUserId(userId);
        // Set other fields as needed

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        // Act
        userService.updateUser(userId, updatedUserData);

        // Assert
        verify(userRepository, times(1)).findById(userId); // Verify that findById method is called once with userId
        verify(userRepository, times(1)).save(existingUser); // Verify that the save method is called once with updated user
        // Add more assertions to verify specific fields are updated as expected
        assertEquals(updatedUserData.getFirstName(), existingUser.getFirstName());
        assertEquals(updatedUserData.getLastName(), existingUser.getLastName());
        assertEquals(updatedUserData.getPhone(), existingUser.getPhone());
    }
}







