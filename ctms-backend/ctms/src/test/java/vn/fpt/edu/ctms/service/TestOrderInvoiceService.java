package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.Assertions;
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
import vn.fpt.edu.ctms.dto.request.OrderInvoiceRequest;
import vn.fpt.edu.ctms.model.OrderInvoice;
import vn.fpt.edu.ctms.repository.OrderInvoiceRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class TestOrderInvoiceService {
    @Spy
    private ModelMapper modelMapper;
    @Spy
    private OrderInvoiceRepository orderInvoiceRepository;
    @InjectMocks
    private OrderInvoiceService orderInvoiceService;
    @Mock
    private BlobService blobService;
    @Test
    public void testGetorderInvoiceByCriteria() {
        // Mocking orderInvoiceRepository behavior
        Page<OrderInvoice> mockPage = mock(Page.class);
        when(mockPage.getContent()).thenReturn(Collections.emptyList());
        when(mockPage.getTotalPages()).thenReturn(1);
        when(orderInvoiceRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(mockPage);

        // Calling the method under test
        HashMap<String, Object> result = orderInvoiceService.
                getOrderInvoiceByCriteria(new OrderInvoiceDTO(), new OrderDTO(), new UserDTO(), 0, 10);

        // Assertions
        assertNotNull(result);
        assertTrue(result.containsKey("orderInvoices"));
        assertTrue(result.containsKey("totalPage"));
        assertEquals(1, result.get("totalPage"));
        assertEquals(0, ((List<?>) result.get("orderInvoices")).size());
    }

    @Test
    public void testAddorderInvoice() {
        OrderInvoice orderInvoice = createOrderInvoice();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());

        // Calling the method under test
        HashMap<Integer, List<String>> status = orderInvoiceService.
                addOrderInvoice(orderInvoice,  "id-2", "id-5",file);
        // Assertions
        assertEquals(1, status.size());
        assertEquals(Constants.StatusCode.SUCCESS, status.keySet().iterator().next());
        assertEquals("Tạo hóa đơn mua hàng thành công !", status.get(Constants.StatusCode.SUCCESS).get(0));
    }

    @Test
    public void testEditorderInvoice() {
        String orderInvoiceId ="100b8a28-73b5-487d-a650-b14a189c79aa";
        OrderInvoice orderInvoice =  createOrderInvoice();
        OrderInvoice newOrderInvoice =  createOrderInvoice();
        MockMultipartFile file = new MockMultipartFile("file", "test.txt",
                "text/plain", "Hello, World!".getBytes());
        //Mocking
        when(orderInvoiceRepository.findOrderInvoiceByOrderInvoiceId(orderInvoiceId)).thenReturn(Optional.of(orderInvoice));
        when(orderInvoiceRepository.save(any())).thenReturn(new OrderInvoice());
        //act
        var result = orderInvoiceService.editOrderInvoice(newOrderInvoice,"id-2", "id-5",file);
        //
        assertNotNull(result);
        assertEquals(Constants.StatusCode.SUCCESS, result.keySet().iterator().next());
        assertEquals("Sửa hóa đơn mua hàng thành công !", result.get(Constants.StatusCode.SUCCESS).get(0));



    }


    private OrderInvoice createOrderInvoice() {
        return OrderInvoice.builder()
                .orderInvoiceId("100b8a28-73b5-487d-a650-b14a189c79aa")
                .note("132")
                .paymentMethod("ATM")
                .tax(15.f)
                .shippingCost(150000.f)
                .paymentDate(LocalDate.now())
                .attach("attach")
                .invoiceNumber("invoiceNumber")
                .build();
    }
}
