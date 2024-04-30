package vn.fpt.edu.ctms.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.NullPointerExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.AccountRepository;
import vn.fpt.edu.ctms.repository.UserRepository;
import vn.fpt.edu.ctms.specification.UserSpecification;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final ContainerTruckService containerTruckService;

    private final AccountRepository accountRepository;



    @Transactional(readOnly = true)
    public boolean emailExisted(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findbyUserId(String userId){
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundExc("User not found with ID: " + userId));
            return user;
    }

    @Transactional(readOnly = true)
    public Page<User> getUsersByCriteria(UserDTO user, Pageable pageable) {
        Specification<User> spec = UserSpecification.filterByAllFields(user);
        return userRepository.findAll(spec, pageable);
    }


    public User createUser(UserDTO userRequest) {
       validateUserRequest(userRequest);

        User user = mapUserRequestToUser(userRequest);


        String userNumber = generateUsername(userRequest.getFirstName()+" " +userRequest.getLastName());


        if(userRequest.getRole().equalsIgnoreCase("driver") || userRequest.getRole().equalsIgnoreCase("staff")){

            if(Objects.nonNull(userRequest.getFixedSalary())){
                user.setFixedSalary(userRequest.getFixedSalary());
            }

        }

        user.setUserNumber(userNumber);

        userRepository.save(user);

        if(userRequest.getRole().equalsIgnoreCase("driver")){

            containerTruckService.editUserContainerTruck(userRequest.getTruckId(), user.getUserId());
        }



        return user;
    }

    private User mapUserRequestToUser(UserDTO userRequest) {
        return User.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .address(userRequest.getAddress())
                .phone(userRequest.getPhone())
                .email(userRequest.getEmail())
                .role(Role.valueOf(userRequest.getRole()))
                .personalId(userRequest.getPersonalId())
                .image(userRequest.getImage())
                .birthDate(userRequest.getBirthDate())
                .isActive(userRequest.getIsActive())
                .build();
    }

    public void validateUserRequest(UserDTO userRequest) {
        if (Objects.isNull(userRequest.getFirstName()) || userRequest.getFirstName().isEmpty()) {
            throw new NullPointerExc("First name is required.");
        } else if (userRequest.getFirstName().length() > 50) {
            throw new ValidationExc("First name must be less than 50 characters.");
        }

        if (Objects.isNull(userRequest.getLastName()) || userRequest.getLastName().isEmpty()) {
            throw new NullPointerExc("Last name is required.");
        } else if (userRequest.getLastName().length() > 50) {
            throw new ValidationExc("Last name must be less than 50 characters.");
        }

        if (userRequest.getAddress() != null && userRequest.getAddress().length() > 255) {
            throw new NullPointerExc("Address must be less than 255 characters.");
        }

        if(StringUtils.isEmpty(userRequest.getPhone())){
            throw new NullPointerExc("Phone is required.");

        }

        if (userRequest.getEmail().isEmpty()) {
            throw new NullPointerExc("Email is required.");
        } else if (emailExisted(userRequest.getEmail())) {
            throw new ValidationExc("Email is existed.");
        } else if (!isValidEmail(userRequest.getEmail())) {
            throw new ValidationExc("Invalid email format.");
        }

        if (Objects.isNull(userRequest.getRole())) {
            throw new NullPointerExc("Role is required");
        } else if(!isValidRole(userRequest.getRole())){
            throw new ValidationExc("Invalid Role!");
        }

        if (Objects.isNull(userRequest.getPersonalId()) ) {
            throw new NullPointerExc("PersonalId is required");
        }else if(userRequest.getPersonalId().length() != 12){
            throw new ValidationExc("Invalid PersonalId!");
        }

        if (Objects.isNull(userRequest.getBirthDate())) {
            throw new NullPointerExc("Birthdate is require");
        } else if(!isValidBirthDate(userRequest.getBirthDate())){
            throw new ValidationExc("Invalid birthdate!");

        }

        if (Objects.isNull(userRequest.getIsActive())) {
            userRequest.setIsActive(true);
        }


    }



    private boolean isValidRole(String role) {
        for (Role validRole : Role.values()) {
            if (validRole.name().equalsIgnoreCase(role)) {
                return true;
            }
        }
        return false;
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return false;
        }

        String digits = phoneNumber.replaceAll("[^0-9]", "");

        return digits.length() == 10 && (digits.startsWith("09") || digits.startsWith("03") || digits.startsWith("08") );
    }
    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

        Pattern pattern = Pattern.compile(emailRegex);

        Matcher matcher = pattern.matcher(email);

        return matcher.matches();
    }

    @Transactional
    public void deactivateUser(String userId) {
        Optional<User> userToDelete = userRepository.findById(userId);

        Optional<Account> account = accountRepository.findOneByUser_UserId(userId);


        userToDelete.ifPresent(user -> {
            user.setIsActive(!user.getIsActive());
            userRepository.save(user);
        });

           account.ifPresent(acc -> {
               acc.setIsActive(userToDelete.get().getIsActive());
           });

    }

    private Boolean isValidBirthDate(String birthDate) {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        try {
            LocalDate parsedDate = LocalDate.parse(birthDate, dateFormatter);

            LocalDate minDate = LocalDate.of(1900, 1, 1);
            LocalDate maxDate = LocalDate.now();

            return !parsedDate.isBefore(minDate) && !parsedDate.isAfter(maxDate);
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    private <T> void updateFieldIfNotNull(T value, Consumer<T> updater) {
        if (value != null) {
            updater.accept(value);
        }
    }


    public User updateUser(String userId, UserDTO updatedUserData) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundExc("User not found"));


        updateFieldIfNotNull(updatedUserData.getFirstName(), existingUser::setFirstName);
        updateFieldIfNotNull(updatedUserData.getLastName(), existingUser::setLastName);
        updateFieldIfNotNull(updatedUserData.getAddress(), existingUser::setAddress);
        updateFieldIfNotNull(updatedUserData.getPhone(), existingUser::setPhone);

        updateFieldIfNotNull(updatedUserData.getPersonalId(), personalId ->{
            existingUser.setPersonalId(personalId);
                    if (!personalId.matches("\\d{12}")){
                        throw new ValidationExc("Invalid personalId");
                    }
                }
                );
        updateFieldIfNotNull(updatedUserData.getImage(), existingUser::setImage);
        updateFieldIfNotNull(updatedUserData.getBirthDate(), existingUser::setBirthDate);
        updateFieldIfNotNull(updatedUserData.getIsActive(), existingUser::setIsActive);

        return userRepository.save(existingUser);
    }


    public static String generateUsername(String fullName) {

        fullName = removeAccent(fullName);
        String[] words = fullName.split("\\s+");

        StringBuilder usernameBuilder = new StringBuilder();

        String lastWord = words[words.length - 1];
        usernameBuilder.append(lastWord);

        for (int i = 0; i < words.length - 1; i++) {
            String word = words[i];
            if (!word.isEmpty()) {
                usernameBuilder.append(word.charAt(0));
            }
        }

        Random random = new Random();
        for (int i = 0; i < 4; i++) {
            usernameBuilder.append(random.nextInt(10));
        }

        return usernameBuilder.toString().toLowerCase();
    }

    public static String removeAccent(String s) {
        s= s.toLowerCase();
        s = s.replaceAll("đ", "d");
        String temp = Normalizer.normalize(s, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

        return pattern.matcher(temp).replaceAll("");
    }
    public Boolean checkIsDriver(String driverId){
        var user = userRepository.findByUserId(driverId);
        if(user.get().getRole().equals(Role.DRIVER)){
            return true;
        }
        return false;
    }


}



