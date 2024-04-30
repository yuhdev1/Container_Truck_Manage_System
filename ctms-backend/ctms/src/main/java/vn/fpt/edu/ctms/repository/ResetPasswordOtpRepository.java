package vn.fpt.edu.ctms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.fpt.edu.ctms.model.ResetPasswordOtp;

import java.util.Optional;

@Repository
public interface ResetPasswordOtpRepository extends JpaRepository<ResetPasswordOtp, String> {
    Optional<ResetPasswordOtp> findByEmail(String email);
}
