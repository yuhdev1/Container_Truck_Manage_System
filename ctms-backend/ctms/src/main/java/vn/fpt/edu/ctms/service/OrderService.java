package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.RunTimeExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.ContainerTruckRepository;
import vn.fpt.edu.ctms.repository.DriverScheduleRepository;
import vn.fpt.edu.ctms.repository.OrderRepository;
import vn.fpt.edu.ctms.specification.OrderSpecification;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final AuthenticationService authenticationService;

    private final NotificationService notificationService;

    private final DriverScheduleRepository driverScheduleRepository;
//
//
    private final ContainerTruckRepository containerTruckRepository;


    @Transactional(readOnly = true)
    public Page<Order> getOrderByCriteria(OrderDTO orderDTO, Pageable pageable) {
        Specification<Order> spec = OrderSpecification.filterByAllFields(orderDTO);
        return orderRepository.findAll(spec, pageable);
    }


    public Order save(Order order) {
        return orderRepository.save(order);
    }


    public Order findByOrderId(String OrderId) {
        Order order = orderRepository.findByOrderId(OrderId)
                .orElseThrow(() -> new NotFoundExc("Order not found with ID: " + OrderId));

        return order;
    }


    private <T> void updateFieldIfNotNull(T value, Consumer<T> updater) {
        if (value != null) {
            updater.accept(value);
        }
    }


//    @Transactional
//    public Order updateOrder(String OrderId, OrderDTO orderDTO) {
//        Order order = orderRepository.findByOrderId(OrderId)
//                .orElseThrow(() -> new NotFoundExc("Order not found with ID: " + OrderId));
//
//
//            updateFieldIfNotNull(orderDTO.getShippingDate(), order::setShippingDate);
//            updateFieldIfNotNull(orderDTO.getDescription(), order::setDescription);
//            updateFieldIfNotNull(orderDTO.getRealityDeliveryDate(), order::setRealityDeliveryDate);
//
//
//            if (Objects.nonNull(orderDTO.getStatus()) && orderDTO.getStatus().equals("CONFIRM")) {
//
//
//                order.setStatus(Status.valueOf(orderDTO.getStatus()));
//
//
//                List<Notification> notificationList = notificationService.findByOrderId(order.getOrderId());
//
//
//                Optional<Notification> notification = notificationList.stream()
//                        .filter(noti -> noti.getOrder().getOrderId().equalsIgnoreCase(order.getOrderId()))
//                        .filter(noti -> noti.getReceiver().equalsIgnoreCase("staff"))
//                        .findFirst();
//
//                if (notification.isPresent()) {
//                    Notification noti = notification.get();
//                } else {
//                    Notification noti = Notification.builder()
//                            .customer(order.getCustomer())
//                            .order(order)
//                            .content("Đơn hàng " + order.getOrderNumber() + " đã được xác minh thành công")
//                            .receiver("staff")
//                            .seen(false)
//                            .timestamp(LocalDateTime.now().toString()).build();
//
//                    notificationService.save(noti);
//                    notificationService.sendNotification(noti);
//
//                }
//
//            }
//
//
//            if(Objects.nonNull(orderDTO.getPayment())){
//                order.setPayment(Payment.valueOf(orderDTO.getPayment()));
//            }
//
//
//
//
//        return orderRepository.save(order);
//    }

    @Transactional
    public Order updateOrder(String OrderId, OrderDTO orderDTO) {
        Order order = orderRepository.findByOrderId(OrderId)
                .orElseThrow(() -> new NotFoundExc("Order not found with ID: " + OrderId));

        UserDetails user = authenticationService.getCurrentUserDetails();

        if (user.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_STAFF"))) {

            updateFieldIfNotNull(orderDTO.getShippingDate(), order::setShippingDate);
            updateFieldIfNotNull(orderDTO.getDescription(), order::setDescription);
            updateFieldIfNotNull(orderDTO.getRealityDeliveryDate(), order::setRealityDeliveryDate);
            if (Objects.nonNull(orderDTO.getStatus())) {
                Optional<DriverSchedule> driverSchedule = driverScheduleRepository.findByOrderOrderId(order.getOrderId());

                if(orderDTO.getStatus().equals("TOSHIP")){
                    if(driverSchedule.isPresent()) {
                        ContainerTruck truck = driverSchedule.get().getContainerTruck();
                        truck.setContainerStatus(ContainerStatus.ACTIVE);
                    }
                }

                if(orderDTO.getStatus().equals("COMPLETED") && order.getPayment() == Payment.TIỀN_MẶT){
                    order.setPaid(true);
                }

                if (orderDTO.getStatus().equals("COMPLETED") && !order.getPaid()) {
                    throw new RunTimeExc("this order has not paid yet!");
                } else if(orderDTO.getStatus().equals("COMPLETED") && order.getPaid()) {
                    if(driverSchedule.isPresent()) {
                        ContainerTruck truck = driverSchedule.get().getContainerTruck();
                        truck.setContainerStatus(ContainerStatus.READY);
                        containerTruckRepository.save(truck);
                    }

                }

                order.setStatus(Status.valueOf(orderDTO.getStatus()));
            }

        } else if (user.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_CUSTOMER"))) {
            if (Objects.nonNull(orderDTO.getStatus()) && orderDTO.getStatus().equals("CONFIRM")) {


                order.setStatus(Status.valueOf(orderDTO.getStatus()));


                List<Notification> notificationList = notificationService.findByOrderId(order.getOrderId());


                Optional<Notification> notification = notificationList.stream()
                        .filter(noti -> noti.getOrder().getOrderId().equalsIgnoreCase(order.getOrderId()))
                        .filter(noti -> noti.getReceiver().equalsIgnoreCase("staff"))
                        .findFirst();

                if (notification.isPresent()) {
                    Notification noti = notification.get();
                } else {
                    Notification noti = Notification.builder()
                            .customer(order.getCustomer())
                            .order(order)
                            .content("Đơn hàng " + order.getOrderNumber() + " đã được xác nhận thành công")
                            .receiver("staff")
                            .seen(false)
                            .timestamp(LocalDateTime.now().toString()).build();

                    notificationService.save(noti);
                    notificationService.sendNotification(noti);

                }

            }


            if (Objects.nonNull(orderDTO.getPayment())) {
                order.setPayment(Payment.valueOf(orderDTO.getPayment()));
            }

        }


        return orderRepository.save(order);
    }


    public Order paidOrder(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NotFoundExc("Order not found with ID: " + orderId));

        order.setPaid(true);

        return orderRepository.save(order);
    }


    public String generateOrderNumber() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMdd");
        String datePart = dateFormat.format(new Date());
        String randomPart = UUID.randomUUID().toString().toUpperCase().replace("-", "").substring(0, 5);
        return datePart + randomPart;
    }


}