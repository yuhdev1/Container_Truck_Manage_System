package vn.fpt.edu.ctms.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.fpt.edu.ctms.model.Role;
import vn.fpt.edu.ctms.model.User;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private String accountId;
    private String username;
    private String password;
    private Role role;
    private Boolean isActive;
    private User user;

}
