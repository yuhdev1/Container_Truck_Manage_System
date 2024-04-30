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
import vn.fpt.edu.ctms.dto.*;
import vn.fpt.edu.ctms.dto.RepairInvoiceDTO;
import vn.fpt.edu.ctms.model.RepairInvoice;
import vn.fpt.edu.ctms.repository.RepairInvoiceRepository;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestRepairInvoiceService {
    @Spy
    private ModelMapper modelMapper;
    @Spy
    private RepairInvoiceRepository repairInvoiceRepository;
    @InjectMocks
    private RepairInvoiceService repairInvoiceService;
    @Mock
    private BlobService blobService;
    @Test
    public void testGetRepairInvoiceByCriteria() {
        // Mocking RepairInvoiceRepository behavior
        Page<RepairInvoice> mockPage = mock(Page.class);

        when(repairInvoiceRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        // Calling the method under test
        HashMap<String, Object> result = repairInvoiceService.
                getRepairInvoiceByCriteria(new RepairInvoiceDTO(), new ContainerTruckDTO(), 0, 4);
        // Assertions
        assertNotNull(result);
    }

    @Test
    public void testAddRepairInvoice() {
        RepairInvoice RepairInvoice = createRepairInvoice();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());

        // Calling the method under test
        HashMap<Integer, List<String>> status = repairInvoiceService.addRepairInvoice(RepairInvoice, "truck-1",file);

        // Assertions
        assertEquals(1, status.size());
        assertEquals(Constants.StatusCode.SUCCESS, status.keySet().iterator().next());
        assertEquals("Tạo hóa đơn sửa chữa thành công !", status.get(Constants.StatusCode.SUCCESS).get(0));
    }

    @Test
    public void testEditRepairInvoice() {
        String repairInvoice ="eec5a781-2625-4e81-86a2-2d5ac2e83e00";
        RepairInvoice RepairInvoice = createRepairInvoice();
        RepairInvoice newRepairInvoice = createRepairInvoice();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());
        //Mocking
        when(repairInvoiceRepository.findRepairInvoiceByRepairInvoiceId(repairInvoice)).thenReturn(Optional.of(RepairInvoice));
        when(repairInvoiceRepository.save(any())).thenReturn(new RepairInvoice());
        //act
        var result = repairInvoiceService.editRepairInvoice(newRepairInvoice,"truck-1",file);
        //Verify the result
        assertNotNull(result);
        assertEquals(Constants.StatusCode.SUCCESS, result.keySet().iterator().next());
        assertEquals("Sửa hóa đơn sửa chữa thành công !", result.get(Constants.StatusCode.SUCCESS).get(0));


    }

    private RepairInvoice createRepairInvoice() {
        return RepairInvoice.builder()
                .repairInvoiceId("eec5a781-2625-4e81-86a2-2d5ac2e83e00")
                .repairDate(LocalDate.now())
                .description("")
                .repairCost(1000.f)
                .paymentMethod("ATM")
                .serviceProvider("serviceProvider")
                .serviceProviderContact("serviceProviderContact")
                .attach("attach")
                .invoiceNumber("invoiceNumber")
                .build();
    }
}
