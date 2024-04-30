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
import vn.fpt.edu.ctms.dto.IncidentInvoiceDTO;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.model.IncidentInvoice;
import vn.fpt.edu.ctms.repository.IncidentInvoiceRepository;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestIncidentInvoiceService {
    @Spy
    private IncidentInvoiceRepository incidentInvoiceRepository;
    @Spy
    private ModelMapper modelMapper;
    @InjectMocks
    private IncidentInvoiceService incidentInvoiceService;
    @InjectMocks
    private UserService userService;
    @Mock
    private BlobService blobService;
    @Test
    public void testGetIncidentInvoiceByCriteria() {
        // Mocking incidentInvoiceRepository behavior
        Page<IncidentInvoice> mockPage = mock(Page.class);
        when(incidentInvoiceRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);
        // Calling the method under test
        HashMap<String, Object> result = incidentInvoiceService.
                getIncidentInvoiceByCriteria(new IncidentInvoiceDTO(), new OrderDTO(), new UserDTO(), 0, 4);

        // Assertions
        assertNotNull(result);
    }

    @Test
    public void testAddIncidentInvoice() {
        IncidentInvoice incidentInvoice = createIncidentInovice();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());

        // Calling the method under test
        HashMap<Integer, List<String>> status = incidentInvoiceService.
                addIncidentInvoice(incidentInvoice, "id-2", "id-2",file);

        // Assertions
        assertEquals(1, status.size());
        assertEquals(Constants.StatusCode.SUCCESS, status.keySet().iterator().next());
        assertEquals("Tạo mới hóa đơn thành công !", status.get(Constants.StatusCode.SUCCESS).get(0));
    }

    @Test
    public void testEditIncidentInvoice() {
        // Mocking incidentInvoiceRepository behavior
        String incidentInvoiceId = "156ea2f2-3b55-47a0-97ac-472732b13d4e";
        IncidentInvoice incidentInvoice = createIncidentInovice();
        IncidentInvoice newIncidentInvoice = createIncidentInovice();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());
        //Mocking
        when(incidentInvoiceRepository.findIncidentInvoiceByIncidentInvoiceId(incidentInvoiceId)).thenReturn(Optional.of(incidentInvoice));

        //act
        var result = incidentInvoiceService.editIncidentInvoice(newIncidentInvoice,"id-2", "id-2",file);
        //Verify the result
        assertNotNull(result);
        assertEquals(Constants.StatusCode.SUCCESS, result.keySet().iterator().next());
        assertEquals("Sửa hóa đơn thành công !", result.get(Constants.StatusCode.SUCCESS).get(0));
    }



    private IncidentInvoice createIncidentInovice() {
        IncidentInvoice incidentInvoiceDTO = new IncidentInvoice();
        incidentInvoiceDTO.setIncidentInvoiceId("156ea2f2-3b55-47a0-97ac-472732b13d4e");
        incidentInvoiceDTO.setDescription("Description of the incident invoice");
        incidentInvoiceDTO.setPaymentMethod("Cash");
        incidentInvoiceDTO.setPaymentDate(LocalDate.now());
        incidentInvoiceDTO.setCost(1000.0f);
        incidentInvoiceDTO.setInvoiceNumber("INV-123456");
        incidentInvoiceDTO.setAttach("path/to/attachment");
        return incidentInvoiceDTO;
    }
}
