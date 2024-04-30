package vn.fpt.edu.ctms.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.OrderDetailDTO;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.OrderDetail;
import vn.fpt.edu.ctms.service.OrderDetailService;

import java.util.List;

@RestController
@RequestMapping("/api/orderDetail")
@RequiredArgsConstructor
@Slf4j
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

//    @PostMapping
//    public ResponseEntity<?> createOrderDetail(@RequestParam String orderId, @RequestBody List<OrderDetailDTO> orderDetailDTOList) {
//
//        log.info("Calling api createOrder/ request: {} ", orderDetailDTOList);
//        try {
//            orderDetailService.saveOrderDetails(orderId, orderDetailDTOList);
//            return ResponseEntity.status(HttpStatus.CREATED).body("Order details add to Order successfully");
//        } catch (Exception e) {
//            log.error("Error creating order:", e);
//            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
//        }
//
//    }

    @GetMapping("")
    public ResponseEntity<?> getOrderDetailsByOrderId(@RequestParam String orderId )  {
        log.info("Calling api getUserByCriteria/ request: {} ", orderId);
        List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByOrderId(orderId);
        return ResponseEntity.ok(orderDetails);
    }


}
