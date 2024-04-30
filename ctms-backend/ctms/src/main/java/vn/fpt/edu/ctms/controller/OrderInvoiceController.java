package vn.fpt.edu.ctms.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.OrderInvoiceDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.dto.request.OrderInvoiceRequest;
import vn.fpt.edu.ctms.dto.request.RepairInvoiceRequest;
import vn.fpt.edu.ctms.dto.response.OrderInvoiceResponse;
import vn.fpt.edu.ctms.model.OrderInvoice;
import vn.fpt.edu.ctms.service.ExcelService;
import vn.fpt.edu.ctms.service.OrderInvoiceService;
import vn.fpt.edu.ctms.util.helper.ExcelHelper;

import java.time.LocalDate;
import java.util.HashMap;

@RestController
@RequestMapping("/api/invoice/order")
@RequiredArgsConstructor
@Slf4j
public class OrderInvoiceController {
    private final OrderInvoiceService orderInvoiceService;
    private final ModelMapper modelMapper;
    private final ExcelService excelService;

    @GetMapping("")
    public ResponseEntity<HashMap<String, Object>> getOrderInvoiceByCriteria(
            OrderInvoiceDTO orderInvoiceDTO,
            OrderDTO orderDTO,
            UserDTO userDTO,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int pageSize

    ) {
        log.info("Calling api getIncidentInvoiceByCriteria/ OrderInvoiceDTO : {} ,OrderDTO {}  ", orderInvoiceDTO, orderDTO);
        return ResponseEntity.ok(orderInvoiceService.getOrderInvoiceByCriteria(orderInvoiceDTO, orderDTO, userDTO, page, pageSize));
    }

    @PostMapping("add")
    public ResponseEntity<?> createOrderInvoice(@RequestPart("orderInvoiceRequest") OrderInvoiceRequest orderInvoiceRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api createOrderInvoice/ request: {} ", orderInvoiceRequest.getOrderInvoiceDTO());
        try {
            var orderInvoice = modelMapper.map(orderInvoiceRequest.getOrderInvoiceDTO(), OrderInvoice.class);
            var added = orderInvoiceService.addOrderInvoice(orderInvoice,
                    orderInvoiceRequest.getOrderId(), orderInvoiceRequest.getCustomerId(), file);
            return new ResponseEntity<>(added.values(), HttpStatusCode.valueOf(added.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error creating IncidentInvoice:", e);
            return ResponseEntity.badRequest().body("Lỗi tạo mới hóa đơn mua hàng : " + e.getMessage());
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editOrderInvoice(@RequestPart("orderInvoiceRequest") OrderInvoiceRequest orderInvoiceRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api editOrderInvoice/ request: {} ", orderInvoiceRequest);
        try {
            var orderInvoice = modelMapper.map(orderInvoiceRequest.getOrderInvoiceDTO(), OrderInvoice.class);
            var edited = orderInvoiceService.editOrderInvoice(orderInvoice,
                    orderInvoiceRequest.getOrderId(), orderInvoiceRequest.getCustomerId(), file);
            log.info("Edit success OrderInvoiceId : {} ", orderInvoiceRequest.getOrderInvoiceDTO().getOrderInvoiceId());
            return new ResponseEntity<>(edited.values(), HttpStatusCode.valueOf(edited.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error creating :", e);
            return ResponseEntity.badRequest().body("Lỗi sửa hóa đơn mua hàng : " + e.getMessage());
        }
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (ExcelHelper.hasExcelFormat(file)) {
            try {
                var upload = excelService.saveExcel(file, Constants.Invoice.ORDER);
                return new ResponseEntity<>(upload.values(), HttpStatusCode.valueOf(upload.keySet().iterator().next()));
            } catch (Exception e) {
                log.error("Error upload:", e);
                return ResponseEntity.badRequest().body("Lỗi thêm mới hóa đơn đơn hàng: " + e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body("Lỗi thêm mới hóa đơn đơn hàng !");
    }

    @GetMapping("/download")
    public ResponseEntity<?> exportFile() {
        LocalDate currentDate = LocalDate.now();
        String filename = ExcelHelper.FILE_NAME_FOR_ORDER + currentDate.toString() + ".xlsx";
        ByteArrayResource file = new ByteArrayResource(excelService.exportToFile(Constants.Invoice.ORDER).toByteArray());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }

}
