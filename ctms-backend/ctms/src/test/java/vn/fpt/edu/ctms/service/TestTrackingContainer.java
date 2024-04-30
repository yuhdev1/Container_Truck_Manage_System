package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.*;

import java.util.*;
import vn.fpt.edu.ctms.repository.TrackingContainerRepository;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestTrackingContainer {

    @Test
    public void testFindTrackingContainerOrderId_Success() throws Exception {
        // Mock dependencies
        TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);

        // Mock data
        String orderId = "ABC123";
        TrackingContainer expectedContainer = new TrackingContainer();
        Order order= Order.builder().orderId(orderId).build();
        expectedContainer.setOrder(order);

        // Mock repository behavior
        when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId))
                .thenReturn(Optional.of(expectedContainer));

        // Inject mock into service
        TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);

        // Call the function
        TrackingContainer actualContainer = trackingContainerService.findTrackingContainerOrderId(orderId);

        // Assertions
        assertNotNull(actualContainer);
        assertEquals(expectedContainer, actualContainer);
    }
//
@Test
public void testFindTrackingContainerOrderId_NotFound()  {
    // Mock dependencies (same mock)
    TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);

    // Mock empty optional
    when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(anyString()))
            .thenReturn(Optional.empty());

    // Inject mock and call function
    TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);

    // Assert that the method throws a NotFoundExc
    assertThrows(NotFoundExc.class, () -> {
        trackingContainerService.findTrackingContainerOrderId("123"); // Any ID
    });
}

    @Test
    public void testCheckPoint_SuccessFirstLocation() throws Exception {
        // Mock dependencies
        TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);

        // Mock data
        String orderId = "ABC123";
        String location = "New York";
        TrackingContainer mockContainer = new TrackingContainer();
        Order order= Order.builder().orderId(orderId).build();
        mockContainer.setOrder(order);
        // Mock repository behavior
        when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId))
                .thenReturn(Optional.of(mockContainer));

        // Inject mock and call function
        TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);
        trackingContainerService.checkPoint(orderId, location);

        // Verify repository save with updated first location
        verify(mockTrackingContainerRepository).save(argThat(container ->
                location.equals(container.getFirstLocation()) &&
                        container.getSecondLocation() == null &&
                        container.getThirdLocation() == null));
    }

    @Test
    public void testCheckPoint_SuccessSecondLocation() throws Exception {
        // Similar setup as above, with first location already set
        TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);
// Mock data
        String orderId = "ABC123";
        String location = "New York";
        TrackingContainer mockContainer = new TrackingContainer();
        Order order= Order.builder().orderId(orderId).build();
        mockContainer.setOrder(order);
        mockContainer.setFirstLocation("Los Angeles"); // Set first location

        when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId))
                .thenReturn(Optional.of(mockContainer));


        TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);

        // Call function and verify save with updated second location
        trackingContainerService.checkPoint(orderId, location);
        verify(mockTrackingContainerRepository).save(argThat(container ->
                container.getFirstLocation().equals("Los Angeles") &&
                        location.equals(container.getSecondLocation()) &&
                        container.getThirdLocation() == null));
    }

    @Test
    public void testCheckPoint_SuccessThirdLocation() throws Exception {
        TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);

// Mock data
        String orderId = "ABC123";
        String location = "New York";
        TrackingContainer mockContainer = new TrackingContainer();
        Order order= Order.builder().orderId(orderId).build();
        mockContainer.setOrder(order);
        // Similar setup as above, with first and second locations already set

        mockContainer.setFirstLocation("Los Angeles");
        mockContainer.setSecondLocation("Chicago");

        when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId))
                .thenReturn(Optional.of(mockContainer));

        TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);

        // Call function and verify save with updated third location
        trackingContainerService.checkPoint(orderId, location);
        verify(mockTrackingContainerRepository).save(argThat(container ->
                container.getFirstLocation().equals("Los Angeles") &&
                        container.getSecondLocation().equals("Chicago") &&
                        location.equals(container.getThirdLocation())));
    }

    @Test
    void testCheckPoint_AllLocationsFull() {
        // Arrange
        TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);

        // Tạo một đối tượng TrackingContainer giả định với tất cả các vị trí đã được đặt
        String orderId = "ABC123";
        String location = "New York";
        TrackingContainer mockContainer = new TrackingContainer();
        Order order= Order.builder().orderId(orderId).build();
        mockContainer.setOrder(order);
        mockContainer.setFirstLocation("Los Angeles");
        mockContainer.setSecondLocation("Chicago");
        mockContainer.setThirdLocation("Miami");
        mockContainer.setDestinationLocation("VietNam");

        when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId))
                .thenReturn(Optional.of(mockContainer));

        TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);

        // Act & Assert
        assertThrows(ValidationExc.class, () -> trackingContainerService.checkPoint(orderId, location));
    }

    @Test
    void testCheckPoint_ContainerNotFound() {
        // Arrange
        TrackingContainerRepository mockTrackingContainerRepository = mock(TrackingContainerRepository.class);
        String orderId = "ABC123";
        String location = "New York";

        // Mock repository to return empty optional
        when(mockTrackingContainerRepository.findTrackingContainerByOrder_OrderId(anyString()))
                .thenReturn(Optional.empty());

        TrackingContainerService trackingContainerService = new TrackingContainerService(mockTrackingContainerRepository);

        // Act & Assert
        assertThrows(NotFoundExc.class, () -> trackingContainerService.checkPoint(orderId, location));
    }
}
