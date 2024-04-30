package vn.fpt.edu.ctms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "reset_password_otp")
public class ResetPasswordOtp {
    @Id
    private String id;

    private String otp;

    private Instant expiryDate;

    private String email;

    private boolean isVerified;

    @PrePersist
    public void generateId() {
        this.id = UUID.randomUUID().toString();
    }
}
