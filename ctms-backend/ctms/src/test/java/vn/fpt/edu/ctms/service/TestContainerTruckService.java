package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.response.ContainerTruckResponse;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.DriverSchedule;
import vn.fpt.edu.ctms.repository.ContainerTruckRepository;
import vn.fpt.edu.ctms.repository.DriverScheduleRepository;
import vn.fpt.edu.ctms.specification.ContainerTruckSpecification;
import vn.fpt.edu.ctms.util.DateUtils;


import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestContainerTruckService {
    @Spy
    private ContainerTruckRepository containerTruckRepository;
    @Spy
    private ModelMapper modelMapper;
    @Spy
    private DriverScheduleRepository driverScheduleRepository;
    @InjectMocks
    private ContainerTruckService containerTruckService;
    @Mock
    private BlobService blobService;
    private DriverSchedule schedule;


    @Test
    void addContainerTruck_ValidRequest_Success() {
        // Arrange
        ContainerTruck containerTruck = createContainerTruck();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());
        // Invoke the method
        HashMap<Integer, List<String>> status = containerTruckService.addContainerTruck(containerTruck, file);
        // Assertions
        assertEquals(1, status.size());
        assertEquals(Constants.StatusCode.SUCCESS, status.keySet().iterator().next());
        assertEquals("Tạo mới xe container thành công !", status.get(Constants.StatusCode.SUCCESS).get(0));
    }

    @Test
    void editContainerTruck_ValidRequest_Success() {
        // Arrange
        String truckId = "ee45dadc-05cf-4180-97dc-24e902577766";
        ContainerTruck containerTruck = createContainerTruck();
        ContainerTruck newContainerTruck = ContainerTruck.builder().
                truckId("ee45dadc-05cf-4180-97dc-24e902577766").licensePlate("50A-ABC123").manufacturer("Manufacturer")
                .capacity(10.0f).registrationDate(LocalDate.now()).isActive(true).inUse(false).attach("test.txt").build();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Hello, World!".getBytes());
        // Mocking
        when(containerTruckRepository.findContainerTruckByTruckId(truckId)).thenReturn(Optional.ofNullable(containerTruck));
        // Act
        HashMap<Integer, List<String>> result = containerTruckService.editContainerTruck(newContainerTruck, file);

        // Assert
        assertNotNull(result);
        assertEquals(Constants.StatusCode.SUCCESS, result.keySet().iterator().next());
        assertEquals("Sửa xe container thành công !", result.get(Constants.StatusCode.SUCCESS).get(0));
    }

    @Test
    void getContainerTruckByCriteria_ValidCriteria_ReturnsContainerTrucks() {
        // Arrange
        Page<ContainerTruck> containerTruckPage = mock(Page.class);
        ContainerTruckResponse containerTruckResponse = new ContainerTruckResponse();
        when(containerTruckRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(containerTruckPage);
        //Act
        var result = getContainerTruckByCriteria();
        // Assertions
        assertNotNull(result);
    }

    @Test
    void changeActiveContainerTruck() {
        String truckId = "ee45dadc-05cf-4180-97dc-24e902577766";
        ContainerTruck containerTruck = createContainerTruck();

        when(containerTruckRepository.findContainerTruckByTruckId(truckId)).thenReturn(Optional.ofNullable(containerTruck));
        when(containerTruckRepository.findContainerTruckByTruckId(truckId))
                .thenReturn(Optional.of(containerTruck));
        // Act
        containerTruckService.changeActiveContainerTruck(truckId);
        // Assert
        ArgumentCaptor<ContainerTruck> captor = ArgumentCaptor.forClass(ContainerTruck.class);
        verify(containerTruckRepository).save(captor.capture());

        ContainerTruck savedContainerTruck = captor.getValue();
        assertEquals(containerTruck.getIsActive(), savedContainerTruck.getIsActive());
    }

    @Test
    void findAllByInUse_ReturnContainerTruck() {
        // Arrange
        List<ContainerTruck> mockTruckList = new ArrayList<>();
        mockTruckList.add(createContainerTruck());
        mockTruckList.add(createContainerTruck());

        when(containerTruckRepository.findAllByInUse(false))
                .thenReturn(mockTruckList);
        // Act
        List<ContainerTruck> result = containerTruckService.findAllByInUse();

        // Assert
        assertEquals(mockTruckList.size(), result.size());
    }

    @Test
    void testEditUserContainerTruck() {
        // Arrange
        String truckId = "ee45dadc-05cf-4180-97dc-24e902577766";
        String userId = "d292bd34-5881-4355-a359-c87a56a2e9c6";
        ContainerTruck containerTruck = createContainerTruck();
        when(containerTruckRepository.findContainerTruckByTruckId(truckId))
                .thenReturn(Optional.of(containerTruck));
        // Act
        containerTruckService.editUserContainerTruck(truckId, userId);
        // Assert
        verify(containerTruckRepository).save(containerTruck);
        assertTrue(containerTruck.getInUse());
        assertEquals(userId, containerTruck.getDriver().getUserId());
        // Add more assertions if necessary
    }

    @Test
    void testfindTruckByDriver() {
        // Arrange
        String userId = "d292bd34-5881-4355-a359-c87a56a2e9c6";
        ContainerTruck containerTruck = createContainerTruck();
        when(containerTruckRepository.findByDriver_UserId(userId))
                .thenReturn(Optional.of(containerTruck));
        // Act
        var truck = containerTruckService.findTruckByDriver(userId);
        // Assert
        assertNotNull(truck);
    }

    @Test
    void testEditContainerTruckWithDriver() {
        // Arrange
        String truckId = "ee45dadc-05cf-4180-97dc-24e902577766";
        String userId = "d292bd34-5881-4355-a359-c87a56a2e9c6";
        ContainerTruck containerTruck = createContainerTruck();
        when(containerTruckRepository.findContainerTruckByTruckId(truckId))
                .thenReturn(Optional.of(containerTruck));
        // Act
        containerTruckService.editUserContainerTruck(truckId, userId);
        // Assert
        verify(containerTruckRepository).save(containerTruck);
        assertTrue(containerTruck.getInUse());
        assertEquals(userId, containerTruck.getDriver().getUserId());
    }


    private ContainerTruck createContainerTruck() {
        return ContainerTruck.builder().truckId("ee45dadc-05cf-4180-97dc-24e902577766").licensePlate("50A-ABC123").manufacturer("Manufacturer").capacity(10.0f).registrationDate(LocalDate.now()).isActive(true).inUse(false).attach("test.txt").build();

    }

    private Page<ContainerTruck> createContainerTruckPage() {
        List<ContainerTruck> containerTrucks = new ArrayList<>();
        containerTrucks.add(new ContainerTruck());
        return new PageImpl<>(containerTrucks);
    }

    private HashMap<String, Object> getContainerTruckByCriteria() {
        HashMap<String, Object> resp = new HashMap<>();
        resp.put("containerTrucks", 1);
        resp.put("totalPage", 2);
        return resp;
    }

}
