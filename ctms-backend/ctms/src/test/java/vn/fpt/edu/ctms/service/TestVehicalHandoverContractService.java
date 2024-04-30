package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.dto.VehicleHanoverContractDTO;
import vn.fpt.edu.ctms.model.VehicleHandoverContract;
import vn.fpt.edu.ctms.repository.VehicleHandoverContractRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestVehicalHandoverContractService {
    @InjectMocks
    private VehicleHandoverContractService vehicleHandoverContractService;
    @Spy
    private VehicleHandoverContractRepository vehicleHandoverContractRepository;
    @Spy
    private ModelMapper modelMapper;
    @Mock
    private BlobService blobService;

    @Test
    void TestGetVehicalHandoverContractByCriteria() {
        Page<VehicleHandoverContract> mockPage = mock(Page.class);
        when(vehicleHandoverContractRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);
        // Calling the method under test
        HashMap<String, Object> result = vehicleHandoverContractService.getVehicalHandoverContractByCriteria(new VehicleHanoverContractDTO(),
                new ContainerTruckDTO(), new UserDTO(), 0, 4);
        // Assertions
        assertNotNull(result);
    }

    @Test
    void TestAddVehicalHandoverContract() {
        VehicleHandoverContract vehicleHandoverContract = createHanoverContract();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());
        // Calling the method under test
        HashMap<Integer, List<String>> status = vehicleHandoverContractService.
                addVehicalHandoverContract(vehicleHandoverContract, "truck-1", "id-2", file);
        // Assertions
        assertEquals(1, status.size());
        assertEquals(Constants.StatusCode.SUCCESS, status.keySet().iterator().next());
        assertEquals("Tạo hợp đồng thành công !", status.get(Constants.StatusCode.SUCCESS).get(0));
    }

    @Test
    void TestEditVehicleHandoverContract() {
        String handingContractId = "32b68dba-ffa4-4749-96dd-2c4b8064838e";
        VehicleHandoverContract vehicleHanoverContract = createHanoverContract();
        VehicleHandoverContract newVehicleHanoverContract = createHanoverContract();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());
        //Mocking
        when(vehicleHandoverContractRepository.findById(handingContractId)).thenReturn(Optional.ofNullable(vehicleHanoverContract));
        //act
        var result = vehicleHandoverContractService.editVehicleHandoverContract(newVehicleHanoverContract, "truck-1", "id-2", file);
        //Verify the result
        assertNotNull(result);
        assertEquals(Constants.StatusCode.SUCCESS, result.keySet().iterator().next());
        assertEquals("Sửa hợp đồng thành công !", result.get(Constants.StatusCode.SUCCESS).get(0));
    }

    public VehicleHandoverContract createHanoverContract() {
        return VehicleHandoverContract.builder()
                .handingContractId("32b68dba-ffa4-4749-96dd-2c4b8064838e")
                .contractNumber("ABC123")
                .startDate(LocalDate.now())
                .endDate(LocalDate.of(2024, 4, 30))
                .salary(2000.0f)
                .note("Sample note")
                .attach("attachment.pdf")
                .build();
    }
}
