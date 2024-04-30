package vn.fpt.edu.ctms.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User  {
    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastname")
    private String lastName;

    private String address;

    private String phone;

    private String email;

    @Column(name = "personal_id")
    private String personalId;

    private String image;

    @Column(name = "birthdate")
    private String birthDate;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "hasAccount")
    private Boolean hasAccount;

    @Column(name = "user_number")
    private String userNumber;

    @Column(name = "fixed_salary")
    private Long fixedSalary;


    @PrePersist
    public void generateUserId() {
        this.userId = UUID.randomUUID().toString();
    }
}

