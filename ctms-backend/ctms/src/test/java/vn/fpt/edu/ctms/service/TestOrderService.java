package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import vn.fpt.edu.ctms.dto.*;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.DriverScheduleRepository;
import vn.fpt.edu.ctms.repository.OrderRepository;

import java.sql.Date;
import java.util.*;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestOrderService {
    @Spy
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;


    @Test
    void testGetOrderByCriteria() {
        // Arrange
        Page<Order> mockPage = mock(Page.class);
        when(orderRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);
        // Act
        Page<Order> orders = orderService.getOrderByCriteria(new OrderDTO(), PageRequest.of(0, 4));
        // Assert
        verify(orderRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));

        assertNotNull(orders);
        assertEquals(mockPage, orders);
    }



@Test
public void testUpdateOrder_Success_StaffUpdate() throws Exception {
    // Mock dependencies (replace with your actual implementations)
    OrderRepository mockOrderRepository = mock(OrderRepository.class);
    AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
    NotificationService mockNotificationService = mock(NotificationService.class);
    DriverScheduleRepository mockDriverScheduleRepository = mock(DriverScheduleRepository.class);

    // Mock data
    String orderId = "ABC123";
    OrderDTO orderDTO = new OrderDTO();
    orderDTO.setShippingDate(Date.valueOf("2024-12-12")); // Sample shipping date
    orderDTO.setDescription("Updated description");
    orderDTO.setStatus("PENDING"); // Update status

    Order mockOrder = new Order();
    mockOrder.setOrderId(orderId);
    mockOrder.setPaid(true); // Order is already paid

    UserDetails mockUserDetails = mock(UserDetails.class);
    when(mockUserDetails.getAuthorities()).then(ignored -> Collections.singletonList(new SimpleGrantedAuthority("ROLE_STAFF")));
    when(mockAuthenticationService.getCurrentUserDetails()).thenReturn(mockUserDetails);

    // Mock repository behavior
    when(mockOrderRepository.findByOrderId(orderId)).thenReturn(Optional.of(mockOrder));

    // Inject mocks into the service
    OrderService orderService = new OrderService(mockOrderRepository, mockAuthenticationService, mockNotificationService,mockDriverScheduleRepository,null);

    // Call the function
   orderService.updateOrder(orderId, orderDTO);

    // Assertions
    assertEquals(orderId, mockOrder.getOrderId());
    assertEquals(orderDTO.getShippingDate(), mockOrder.getShippingDate());
    assertEquals(orderDTO.getDescription(), mockOrder.getDescription());
    assertEquals(Status.valueOf(orderDTO.getStatus()), mockOrder.getStatus());

    // Verify no update for payment or notification (staff update)
    verify(mockNotificationService, times(0)).findByOrderId(anyString());
    verify(mockNotificationService, times(0)).save(any());
    verify(mockNotificationService, times(0)).sendNotification(any());
}

    @Test
    public void testUpdateOrder_Success_CustomerConfirmPaid() throws Exception {
        OrderRepository mockOrderRepository = mock(OrderRepository.class);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        NotificationService mockNotificationService = mock(NotificationService.class);


        // Similar setup as above, mocking for customer update with CONFIRM status and paid order
        String orderId = "ABC123";
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setShippingDate(Date.valueOf("2024-12-12")); // Sample shipping date
        orderDTO.setDescription("Updated description");

        orderDTO.setStatus("CONFIRM");


        Order mockOrder = new Order();
        mockOrder.setOrderId(orderId);
        mockOrder.setPaid(true);

        UserDetails mockUserDetails = mock(UserDetails.class);
        when(mockUserDetails.getAuthorities()).then(ignored -> Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        when(mockAuthenticationService.getCurrentUserDetails()).thenReturn(mockUserDetails);

        // Mock notification service (find existing notification not required, create and send)
        List<Notification> emptyList = new ArrayList<>();
        when(mockNotificationService.findByOrderId(orderId)).thenReturn(emptyList);
        when(mockOrderRepository.findByOrderId(orderId)).thenReturn(Optional.of(mockOrder));


        // Call the function and assert
        OrderService orderService = new OrderService(mockOrderRepository, mockAuthenticationService, mockNotificationService,null,null);
        orderService.updateOrder(orderId, orderDTO);

        // Assertions (similar to staff update, with notification)
        verify(mockNotificationService).save(any());
        verify(mockNotificationService).sendNotification(any());
    }

    @Test
    void testFindByOrderId_WhenOrderExists_ExpectOrderReturned() {


        Order expectedOrder = Order.builder()
                .orderId("005b9f6e-c441-4a36-9a06-0752ae1292e5")
                .etd(Date.valueOf("2022-12-12"))
                .eta(Date.valueOf("2022-12-13"))
                .orderNumber("123123")
                .deliveryAddress("Bac Ninh")
                .shippingAddress("Ha Noi")
                .build();


        when(orderRepository.findByOrderId("005b9f6e-c441-4a36-9a06-0752ae1292e5")).thenReturn(Optional.of(expectedOrder));

        // Act
        Order result = orderService.findByOrderId("005b9f6e-c441-4a36-9a06-0752ae1292e5");

        // Assert
        assertEquals(expectedOrder, result);
    }



    @Test
    void testFindByOrderId_WhenOrderNotExists_ExpectNotFoundExcThrown() {
        // Arrange
        String orderId = "non-existent-id";
        when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundExc.class, () -> orderService.findByOrderId(orderId));
    }


    @Test
    void testSave() {
        // Arrange
        Order order = Order.builder()
                .orderId("005b9f6e-c441-4a36-9a06-0752ae1292e5")
                .build();

        when(orderRepository.save(order)).thenReturn(order);

        // Act
        Order savedOrder = orderService.save(order);

        // Assert
        assertNotNull(savedOrder);
        assertEquals(order.getOrderId(), savedOrder.getOrderId());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testPaidOrder() {
        // Arrange
        String orderId = "order123";
        Order order = new Order();
        order.setOrderId(orderId);
        order.setPaid(false);

        // Mock orderRepository.findByOrderId method
        when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));

        // Act
     orderService.paidOrder(orderId);

        // Assert
        assertTrue(order.getPaid());

        // Verify orderRepository.save method is called
        verify(orderRepository, times(1)).save(order);
    }


    @Test
    public void testGenerateOrderNumber_ValidFormat() {
        String orderNumber = orderService.generateOrderNumber();

        assertNotNull(orderNumber, "Order number should not be null");
        assertEquals(11, orderNumber.length(), "Order number should be 13 characters long");

        String datePart = orderNumber.substring(0, 6);
        assertTrue(datePart.matches("\\d{2}\\d{2}\\d{2}"), "Date part should be YYMMDD format");

        String randomPart = orderNumber.substring(6);
        assertEquals(5, randomPart.length(), "Random part should be 5 characters long");
        assertTrue(randomPart.matches("[A-Z0-9]+"), "Random part should only contain uppercase letters and digits");
    }
    @Test
    public void testUpdateOrder_OrderNotFound() {
        OrderRepository mockOrderRepository = mock(OrderRepository.class);
        AuthenticationService mockAuthenticationService = mock(AuthenticationService.class);
        NotificationService mockNotificationService = mock(NotificationService.class);

        when(mockOrderRepository.findByOrderId(anyString())).thenReturn(Optional.empty());

        OrderService orderService = new OrderService(mockOrderRepository, mockAuthenticationService, mockNotificationService,null,null);

        assertThrows(NotFoundExc.class, () -> orderService.updateOrder("123", new OrderDTO()));
    }



}




