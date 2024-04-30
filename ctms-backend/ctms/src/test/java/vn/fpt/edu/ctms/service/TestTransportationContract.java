package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.TransportationContractDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.NullPointerExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.OrderRepository;
import vn.fpt.edu.ctms.repository.TransportationContractRepository;

import java.sql.Date;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestTransportationContract {
    @Spy
    private TransportationContractRepository transportationContractRepository;

    @Mock
    private OrderService orderService;

    @Mock
    private BlobService blobService;

    @Mock
    private DriverScheduleService driverScheduleService;

    @InjectMocks
    private TransportationContractService transportationContractService;


    @Test
    void testGetPurchaseContractByCriteria(){
        // Arrange
        Page<TransportationContract> mockPage = mock(Page.class);
        when(transportationContractRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);
        // Act
        Page<TransportationContract> orders = transportationContractService.getPurchaseContractByCriteria(new TransportationContractDTO(), PageRequest.of(0, 4));
        // Assert
        verify(transportationContractRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));

        assertNotNull(orders);
        assertEquals(mockPage, orders);
    }

    @Test
    public void testValidateTransportationContractRequest_NullEtd() {
        TransportationContractDTO contractDTO = new TransportationContractDTO();
        contractDTO.setEta(Date.valueOf("2022-12-11"));
        contractDTO.setRequestedDeliveryDate(Date.valueOf("2022-12-12"));
        contractDTO.setDeposit(Long.valueOf("123123123"));
        contractDTO.setDeliveryAddress("bac ninh");
        contractDTO.setShippingAddress("ha noi");
        contractDTO.setCustomerId("123123123");

        assertThrows(NullPointerExc.class, () -> transportationContractService.validateTransportationContractRequest(contractDTO));
    }

    @Test
    public void testValidateTransportationContractRequest_NullEta() {
        TransportationContractDTO contractDTO = new TransportationContractDTO();
        contractDTO.setEtd(Date.valueOf("2022-12-12"));
        contractDTO.setRequestedDeliveryDate(Date.valueOf("2022-12-12"));
        contractDTO.setDeposit(Long.valueOf("123123123"));
        contractDTO.setDeliveryAddress("bac ninh");
        contractDTO.setShippingAddress("ha noi");
        contractDTO.setCustomerId("123123123");

        assertThrows(NullPointerExc.class, () -> transportationContractService.validateTransportationContractRequest(contractDTO));
    }

    // Similarly, write test methods for other conditions like null requested delivery date, empty shipping address, etc.



//    @Test
//    public void testUpdateTransportationContract_Success() throws Exception {
//        // Mock dependencies (replace with your actual implementations)
//        TransportationContractRepository mockTransportationContractRepository = mock(TransportationContractRepository.class);
//        OrderService mockOrderService = mock(OrderService.class);
//        BlobService mockBlobService = mock(BlobService.class);
//        DriverScheduleService mockDriverScheduleService = mock(DriverScheduleService.class);
//        MultipartFile mockMultipartFile = mock(MultipartFile.class);
//        UserService mockUserService = mock(UserService.class);
//        // Mock data
//        String contractId = "1234";
//        String contractNumber = "ABC123";
//        String fileName = "contract.pdf";
//        TransportationContractDTO contractDTO = new TransportationContractDTO();
//        contractDTO.setEta(Date.valueOf("2024-04-20"));
//        contractDTO.setEtd(Date.valueOf("2024-04-19"));
//        contractDTO.setRequestedDeliveryDate(Date.valueOf("2024-04-21"));
//        contractDTO.setShippingAddress("Ha Noi");
//        contractDTO.setDeliveryAddress("Bac Ninh");
//        contractDTO.setDeposit(100L);
//        contractDTO.setNote("Updated note");
//
//        TransportationContract existingContract = new TransportationContract();
//        existingContract.setId(contractId);
//        existingContract.setContractNumber(contractNumber);
//        existingContract.setAttach("old_file.pdf");
//        Order order = new Order();
//        existingContract.setOrder(order);
//        Optional<DriverSchedule> emptyDriverSchedule = Optional.empty();
//
//        // Mock behavior
//        when(mockTransportationContractRepository.findById(contractId)).thenReturn(Optional.of(existingContract));
//
//        when(mockOrderService.findByOrderId(existingContract.getOrder().getOrderId())).thenReturn(order);
//        when(mockDriverScheduleService.findByOrderId(order.getOrderId())).thenReturn(emptyDriverSchedule);
//
//        // Service under test
//        TransportationContractService transportationContractService = new TransportationContractService(
//                mockTransportationContractRepository,mockUserService, mockOrderService,null, mockBlobService, mockDriverScheduleService);
//
//        // Call the function
//transportationContractService.updateTransportationContract(contractId, contractDTO, mockMultipartFile);
//
//        // Assertions
//        assertEquals(contractId, existingContract.getId());
//        assertEquals(contractNumber, existingContract.getContractNumber());
//        assertEquals(contractDTO.getEta(), existingContract.getEta());
//        assertEquals(contractDTO.getEtd(), existingContract.getEtd());
//        assertEquals(contractDTO.getRequestedDeliveryDate(), existingContract.getRequestedDeliveryDate());
//        assertEquals(contractDTO.getShippingAddress(), existingContract.getShippingAddress());
//        assertEquals(contractDTO.getDeliveryAddress(), existingContract.getDeliveryAddress());
//        assertEquals(contractDTO.getDeposit(), existingContract.getDeposit());
//        assertEquals(contractDTO.getNote(), existingContract.getNote());
//        verify(mockTransportationContractRepository).save(existingContract); // Verify contract saved
//    }

// Add similar tests for other scenarios:


    // Similarly, write test methods for other scenarios like uploading a file, overlapping driver schedule, etc.
}



