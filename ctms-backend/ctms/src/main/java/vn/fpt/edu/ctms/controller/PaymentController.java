package vn.fpt.edu.ctms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.fpt.edu.ctms.dto.response.PaymentResponse;
import vn.fpt.edu.ctms.dto.response.PaymentStatusResponse;
import vn.fpt.edu.ctms.service.PaymentService;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/url")
    public ResponseEntity<PaymentResponse> createPaymentUrl(@RequestParam long amount, @RequestParam(required = false) String bankCode, @RequestParam String orderId) {
        try {
            return ResponseEntity.ok(paymentService.createPayment(amount, bankCode, orderId));
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /*@GetMapping("/status")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(
            @RequestParam(value = "vnp_Amount") String amount,
            @RequestParam(value = "vnp_BankCode") String bankCode,
            @RequestParam(value = "vnp_OrderInfo") String order,
            @RequestParam(value = "vnp_ResponseCode") String responseCode
    ) {
        PaymentStatusResponse resp;
        if (responseCode.equals("00")) {
            resp = PaymentStatusResponse.builder().status("200").message("Thanh toán thành công!").data("").build();
        } else {
            resp = PaymentStatusResponse.builder().status("200").message("Thanh toán thành công!").data("").build();
        }
        return ResponseEntity.ok(resp);
    }*/
}
