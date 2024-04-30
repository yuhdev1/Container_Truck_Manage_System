package vn.fpt.edu.ctms.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.request.AuthenticationRequest;
import vn.fpt.edu.ctms.dto.request.ChangePasswordRequest;
import vn.fpt.edu.ctms.dto.request.RefreshTokenRequest;
import vn.fpt.edu.ctms.dto.request.VerifyOtpRequest;
import vn.fpt.edu.ctms.dto.response.AuthenticationResponse;
import vn.fpt.edu.ctms.dto.response.RefreshTokenResponse;
import vn.fpt.edu.ctms.service.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        log.info("Calling api login/ request: {} ", request);
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(
            @RequestBody RefreshTokenRequest request) {
        try {
            log.info("calling refresh token");
            var res = authenticationService.getRefreshToken(request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            log.error("Get refresh token failed");
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/pass")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request) {
        log.info("Calling api change pass/ request: {} ", request);
        return ResponseEntity.ok(authenticationService.changePass(request));
    }

    @GetMapping("/pass/otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        log.info("Calling api send otp/ email: {} ", email);
        return ResponseEntity.ok(authenticationService.sendOtp(email));
    }

    @PostMapping("/pass/otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        log.info("Calling api verify otp/ request: {} ", request);
        return ResponseEntity.ok(authenticationService.verifyOtp(request));
    }

}
