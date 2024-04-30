package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.fpt.edu.ctms.dto.request.AuthenticationRequest;
import vn.fpt.edu.ctms.dto.request.ChangePasswordRequest;
import vn.fpt.edu.ctms.dto.request.RefreshTokenRequest;
import vn.fpt.edu.ctms.dto.request.VerifyOtpRequest;
import vn.fpt.edu.ctms.dto.response.AuthenticationResponse;
import vn.fpt.edu.ctms.dto.response.RefreshTokenResponse;
import vn.fpt.edu.ctms.exception.ExpiredJwtExc;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.AccountRepository;
import vn.fpt.edu.ctms.repository.RefreshTokenRepository;
import vn.fpt.edu.ctms.repository.ResetPasswordOtpRepository;
import vn.fpt.edu.ctms.repository.UserRepository;
import vn.fpt.edu.ctms.specification.AccountSpecification;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final RefreshTokenRepository tokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ResetPasswordOtpRepository resetPasswordOtpRepository;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("authentication service/ authenticate");
        Account account;
        String refreshToken;
        var authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password()
        ));
        if (authentication.isAuthenticated()) {
            account = accountRepository.findByUsername(request.username()).orElseThrow();
            User user = account.getUser();
            var jwtToken = jwtService.generateToken(account);
            var refreshTokenOpt = tokenRepository.findFirstTokenByAccount(account);

            if (refreshTokenOpt.isEmpty()) {
                refreshToken = createRefreshToken(account.getAccountId()).getRefreshToken();
            } else refreshToken = refreshTokenOpt.get().getRefreshToken();

            String username = user.getFirstName() + " " + (user.getLastName() == null ? "" : user.getLastName());
            return AuthenticationResponse
                    .builder()
                    .userId(user.getUserId())
                    .email(request.email())
                    .image(user.getImage())
                    .username(username)
                    .role(String.valueOf(user.getRole()))
                    .token(jwtToken)
                    .isActive(user.getIsActive())
                    .userExisted(true)
                    .refreshToken(refreshToken)
                    .userNumber(user.getUserNumber())
                    .build();
        } else {
            throw new UsernameNotFoundException("invalid user request !");
        }


    }


    public RefreshTokenResponse getRefreshToken(RefreshTokenRequest request) {
        var refreshTokenOpt = tokenRepository.findRefreshTokenByRefreshToken(request.refreshToken());
        //check if refresh token not exist
        if (refreshTokenOpt.isEmpty()) return new RefreshTokenResponse(null, null);
        var refreshToken = refreshTokenOpt.get();
        return refreshTokenOpt
                .map(this::verifyExpiration)
                .map(RefreshToken::getAccount)
                .map(account -> {
                    String accessToken = jwtService.generateToken(account);
                    return new RefreshTokenResponse(accessToken, request.refreshToken());
                }).orElseThrow(() -> new NotFoundExc(
                        "Refresh token is not in database!"));
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            tokenRepository.delete(token);
            throw new ExpiredJwtExc(token.getRefreshToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public RefreshToken createRefreshToken(String accountId) {
        RefreshToken refreshToken = RefreshToken.builder()
                .account(accountRepository.findByAccountId(accountId))
                .refreshToken(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(1000 * 60 * 60 * 24 * 7))//7d
                .build();
        return tokenRepository.save(refreshToken);
    }


    public UserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return (UserDetails) authentication.getPrincipal();
        }
        return null;
    }


    public String changePass(ChangePasswordRequest request) {
        Account account;
        if (StringUtils.isEmpty(request.email())) {
            //change password case
            var username = SecurityContextHolder.getContext().getAuthentication().getName();
            var accountOpt = accountRepository.findByUsername(username);
            if (accountOpt.isEmpty()) {
                throw new NotFoundExc("Not signed in yet!");
            }
            account = accountOpt.get();
            if (!passwordEncoder.matches(request.oldPass(), account.getPassword())) {
                throw new ValidationExc("Old password not match");
            }
        } else {
            //forgot password case
            var opt = resetPasswordOtpRepository.findByEmail(request.email());
            if (opt.isEmpty() || !opt.get().isVerified()) {
                throw new ValidationExc("Otp not verified yet!");
            }
            account = getAccountFromEmail(request.email());
        }

        if (!request.newPass().equals(request.verifyPass())) {
            throw new ValidationExc("New password and verify password not match");
        }
        account.setPassword(passwordEncoder.encode(request.newPass()));
        accountRepository.save(account);
        return "Đổi mật khẩu thành công!";
    }

    public String sendOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new NotFoundExc("Email not found");
        }
        String otp = random(6);
        ResetPasswordOtp resetPassOtp;
        Optional<ResetPasswordOtp> opt = resetPasswordOtpRepository.findByEmail(email);
        if (opt.isPresent()) {
            resetPassOtp = opt.get();
            resetPassOtp.setOtp(otp);
            resetPassOtp.setExpiryDate(Instant.now().plusMillis(1000 * 60 * 10));
            resetPassOtp.setVerified(false);
        } else {
            resetPassOtp = ResetPasswordOtp.builder().otp(otp)
                    .expiryDate(Instant.now()
                            .plusMillis(1000 * 60 * 10))
                    .email(email)
                    .isVerified(false)
                    .build();
        }
        resetPasswordOtpRepository.save(resetPassOtp);
        emailService.sendOtp(email, otp);
        return "Đã gửi mã xác nhận";
    }

    public Account getAccountFromEmail(String email) {
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getHasAccount()) {
            throw new NotFoundExc("Email not found!");
        }
        Specification<Account> spec = AccountSpecification.filterByUser(userOpt.get().getUserId());
        var accountOpt = accountRepository.findAll(spec);
        if (accountOpt.isEmpty()) {
            throw new NotFoundExc("Account not found!");
        }
        return accountOpt.get(0);
    }

    public static String random(int size) {
        StringBuilder generatedToken = new StringBuilder();
        try {
            SecureRandom number = SecureRandom.getInstance("SHA1PRNG");
            // Generate 20 integers 0..20
            for (int i = 0; i < size; i++) {
                generatedToken.append(number.nextInt(9));
            }
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return generatedToken.toString();
    }

    public String verifyOtp(VerifyOtpRequest request) {
        var opt = resetPasswordOtpRepository.findByEmail(request.email());
        if (opt.isEmpty()) {
            throw new ValidationExc("Xác thực thất bại");
        }
        ResetPasswordOtp resetPasswordOtp = opt.get();
        if (resetPasswordOtp.getExpiryDate().compareTo(Instant.now()) < 0) {
            throw new ValidationExc("Mã xác thực hết hạn!");
        }
        if (!resetPasswordOtp.getOtp().equals(request.otp())) {
            throw new ValidationExc("Xác thực thất bại");
        }
        resetPasswordOtp.setVerified(true);
        resetPasswordOtpRepository.save(resetPasswordOtp);
        return "Xác thực thành công!";
    }
}
