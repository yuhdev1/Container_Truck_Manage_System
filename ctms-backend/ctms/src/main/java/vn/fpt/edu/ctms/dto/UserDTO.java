package vn.fpt.edu.ctms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String userId;
    private String firstName;
    private String lastName;
    private String address;
    private String phone;
    private String email;
    private String role;
    private String personalId;
    private String image;
    private String birthDate;
    private Boolean isActive;
    private Long fixedSalary;
    private String truckId;
    private String userNumber;
    private Boolean hasAccount;
    private String fullName;
    private Boolean isEmployee;
}
