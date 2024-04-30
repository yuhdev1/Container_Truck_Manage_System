package vn.fpt.edu.ctms.dto.request;

public record ChangePasswordRequest(String oldPass, String newPass, String verifyPass, String email) {
}
