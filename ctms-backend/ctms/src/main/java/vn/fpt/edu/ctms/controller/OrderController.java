package vn.fpt.edu.ctms.controller;


import com.amazonaws.services.kms.model.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.service.OrderService;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ModelMapper modelMapper;


    @GetMapping("")
    public ResponseEntity<Page<Order>> getOrderByCriteria(OrderDTO orderCriteria, Pageable pageable) {
        log.info("Calling api getUserByCriteria/ request: {} ", orderCriteria);
        Page<Order> usersPage = orderService.getOrderByCriteria(orderCriteria, pageable);
        return ResponseEntity.ok(usersPage);
    }


    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable String orderId, @RequestBody OrderDTO updatedOrderData) {
        try {
            Order updatedOrder = orderService.updateOrder(orderId, updatedOrderData);
            return ResponseEntity.ok(updatedOrder);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating order: " + e.getMessage());
        }
    }

    @PutMapping("/{orderId}/payment")
    public ResponseEntity<?> payment(@PathVariable String orderId) {
        try {
            Order updatedOrder = orderService.paidOrder(orderId);
            return ResponseEntity.ok(updatedOrder);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error payment : " + e.getMessage());
        }
    }


}
