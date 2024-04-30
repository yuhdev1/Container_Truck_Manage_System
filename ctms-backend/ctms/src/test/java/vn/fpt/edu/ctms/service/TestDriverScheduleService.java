package vn.fpt.edu.ctms.service;


import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import vn.fpt.edu.ctms.dto.*;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.ContainerTruckRepository;
import vn.fpt.edu.ctms.repository.DriverScheduleRepository;
import vn.fpt.edu.ctms.repository.OrderRepository;
import vn.fpt.edu.ctms.repository.TrackingContainerRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestDriverScheduleService {

    @Spy
    private DriverScheduleRepository driverScheduleRepository;

    @InjectMocks
    private DriverScheduleService driverScheduleService;

    @Spy
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Spy
    private ContainerTruckRepository containerTruckRepository;

    @Spy
    private TrackingContainerRepository trackingContainerRepository;

    @Test
    void testGetDriverScheduleByCriteria() {
        // Arrange
        Page<DriverSchedule> mockPage = mock(Page.class);
        when(driverScheduleRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        // Act
        Page<DriverSchedule> users = driverScheduleService.getDriverScheduleByCriteria(new DriverScheduleDTO(),  PageRequest.of(0, 4));

        // Assert
        assertNotNull(users);
        assertEquals(mockPage, users);

        // Verify
        verify(driverScheduleRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    public void testUpdateDriverSchedule_SuccessWithOrder() throws Exception {
        // Mock dependencies (replace with your actual implementations)
        DriverScheduleRepository mockDriverScheduleRepository = mock(DriverScheduleRepository.class);
        OrderRepository mockOrderRepository = mock(OrderRepository.class);

        ContainerTruckRepository mockContainerTruckRepository = mock(ContainerTruckRepository.class);
        OrderService mockOrderService = mock(OrderService.class);
        ContainerTruckService mockContainerTruckService = mock(ContainerTruckService.class);


        // Mock data
        String driverScheduleId = "123";
        DriverScheduleDTO driverScheduleDTO = new DriverScheduleDTO();
        driverScheduleDTO.setOrderId("ABC123");
        Order mockOrder = new Order();
        mockOrder.setOrderId(driverScheduleDTO.getOrderId());
        mockOrder.setEtd(Date.valueOf("2024-12-12")); // Sample ETD
        mockOrder.setEta(Date.valueOf("2024-12-11")); // Sample ETA with 2 hours difference

        User user = User.builder().userId("123").build();

        ContainerTruck containerTruck= ContainerTruck.builder().truckId("123123").driver(user).build();

        DriverSchedule mockDriverSchedule =  DriverSchedule.builder().id(driverScheduleId)
                .containerTruck(containerTruck).build();



        // Mock repository behavior
        when(mockDriverScheduleRepository.findById(driverScheduleId)).thenReturn(Optional.of(mockDriverSchedule));
        when(mockOrderService.findByOrderId(driverScheduleDTO.getOrderId())).thenReturn(mockOrder);

        // Inject mocks into the service
        DriverScheduleService driverScheduleService = new DriverScheduleService(
                mockDriverScheduleRepository, mockOrderService, mockContainerTruckService,mockContainerTruckRepository,null);

        // Call the function
        DriverSchedule updatedSchedule = driverScheduleService.updateDriverSchedule(driverScheduleId, driverScheduleDTO);

        // Assertions
        assertNotNull(updatedSchedule);
        assertEquals(driverScheduleId, updatedSchedule.getId());
        assertEquals(mockOrder, updatedSchedule.getOrder());


        // Verify no overlap check for container truck (since order is set)
        verify(mockContainerTruckRepository, times(0)).findContainerTruckByTruckId(anyString());
    }


    @Test
    void testFindByOrderId_WhenOrderExists_ExpectDriverScheduleReturned() {
        // Arrange
        String orderId = "123456";
        DriverSchedule expectedDriverSchedule = new DriverSchedule(); // Create a dummy DriverSchedule object
        Optional<DriverSchedule> optionalDriverSchedule = Optional.of(expectedDriverSchedule);

        when(driverScheduleRepository.findByOrderOrderId(orderId)).thenReturn(optionalDriverSchedule);

        // Act
        Optional<DriverSchedule> result = driverScheduleService.findByOrderId(orderId);

        // Assert
        assertTrue(result.isPresent()); // Check if Optional contains a value
        assertEquals(expectedDriverSchedule, result.get()); // Check if the returned DriverSchedule is the expected one
    }

    @Test
    void testFindByOrderId_WhenOrderDoesNotExist_ExpectEmptyOptional() {
        // Arrange
        String orderId = "123456";
        Optional<DriverSchedule> optionalDriverSchedule = Optional.empty(); // No DriverSchedule found

        when(driverScheduleRepository.findByOrderOrderId(orderId)).thenReturn(optionalDriverSchedule);

        // Act
        Optional<DriverSchedule> result = driverScheduleService.findByOrderId(orderId);

        // Assert
        assertTrue(result.isEmpty()); // Check if Optional is empty
    }

    @Test
    void testTransportCoordination_Successful() {

        DriverScheduleRepository mockDriverScheduleRepository = mock(DriverScheduleRepository.class);
        OrderRepository mockOrderRepository = mock(OrderRepository.class);

        ContainerTruckRepository mockContainerTruckRepository = mock(ContainerTruckRepository.class);
        OrderService mockOrderService = mock(OrderService.class);
        ContainerTruckService mockContainerTruckService = mock(ContainerTruckService.class);

        TrackingContainerRepository trackingContainerRepository = mock(TrackingContainerRepository.class);
        // Arrange
        String orderId = "123456";
        String truckId = "789";
        Order order = new Order();
        order.setOrderId(orderId);
        order.setEtd(Date.valueOf(LocalDate.now().minusDays(1))); // Past date
        order.setEta(Date.valueOf(LocalDate.now().plusDays(1))); // Future date
        ContainerTruck truck = new ContainerTruck();
        truck.setDriver(new User()); // Set a dummy driver

        TrackingContainer trackingContainer = new TrackingContainer();
        trackingContainer.setContainerTruck(truck);
        Optional<DriverSchedule> optionalDriverSchedule = Optional.empty();


        when(mockOrderService.findByOrderId(orderId)).thenReturn(order);
        when(mockDriverScheduleRepository.findByOrderOrderId(orderId)).thenReturn(optionalDriverSchedule);

        when(trackingContainerRepository.save(any(TrackingContainer.class))).thenReturn(null);
        // Assume trackingContainerRepository returns null
        when(mockContainerTruckService.findContainerTruckByTruckId(truckId)).thenReturn(truck);
        when(mockContainerTruckRepository.save(truck)).thenReturn(truck);

        DriverScheduleService driverScheduleService = new DriverScheduleService(
                mockDriverScheduleRepository, mockOrderService, mockContainerTruckService,mockContainerTruckRepository,trackingContainerRepository);
        // Act
        DriverSchedule result = driverScheduleService.transportCoordination(orderId, truckId);

        // Assert
        assertNotNull(result);
        assertEquals(order, result.getOrder());
        assertEquals(truck, result.getContainerTruck());
        // Add more assertions as needed
    }

    @Test
    void testTransportCoordination_Overlap() {
        // Arrange
        String orderId = "123456";
        String truckId = "789";
        Order order = new Order();
        order.setEtd(Date.valueOf(LocalDate.now().minusDays(1))); // Past date
        order.setEta(Date.valueOf(LocalDate.now().plusDays(1))); // Future date
        ContainerTruck truck = new ContainerTruck();
        truck.setDriver(new User());
        Optional<DriverSchedule> optionalDriverSchedule = Optional.of(new DriverSchedule()); // Simulate existing driver schedule

        when(orderRepository.findByOrderId(orderId)).thenReturn(Optional.of(order));
        when(driverScheduleRepository.findByOrderOrderId(orderId)).thenReturn(optionalDriverSchedule);
        when(containerTruckRepository.findContainerTruckByTruckId(truckId)).thenReturn(Optional.of(truck));

    }




}
