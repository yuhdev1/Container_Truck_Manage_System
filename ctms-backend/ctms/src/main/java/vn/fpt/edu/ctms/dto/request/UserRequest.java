package vn.fpt.edu.ctms.dto.request;

public record UserRequest (
         String firstName,
         String lastName,
         String address,
         String phone,
         String email,
         String role,
         String personalId,
         String image,
         String birthDate

         ){
}
