package vn.fpt.edu.ctms.controller;

import com.ctc.wstx.shaded.msv_core.datatype.xsd.DateTimeType;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.joda.time.DateTime;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.*;
import vn.fpt.edu.ctms.dto.request.IncidentInvoiceRequest;
import vn.fpt.edu.ctms.model.IncidentInvoice;
import vn.fpt.edu.ctms.service.ExcelService;
import vn.fpt.edu.ctms.service.IncidentInvoiceService;
import vn.fpt.edu.ctms.util.helper.ExcelHelper;

import java.time.LocalDate;
import java.util.HashMap;

@RestController
@RequestMapping("/api/invoice/incident")
@RequiredArgsConstructor
@Slf4j
public class IncidentInvoiceController {
    private final IncidentInvoiceService incidentInvoiceService;
    private final ModelMapper modelMapper;
    private final ExcelService excelService;

    @GetMapping("")
    public ResponseEntity<HashMap<String, Object>> getIncidentInvoiceByCriteria(
            IncidentInvoiceDTO incidentInvoiceDTO,
            OrderDTO orderDTO,
            UserDTO userDTO,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int pageSize

    ) {
        log.info("Calling api getIncidentInvoiceByCriteria/ IncidentInvoiceDTO : {} ,OrderDTO {}  ", incidentInvoiceDTO, orderDTO);
        return ResponseEntity.ok(incidentInvoiceService.getIncidentInvoiceByCriteria(incidentInvoiceDTO, orderDTO, userDTO, page, pageSize));
    }

    @PostMapping("add")
    public ResponseEntity<?> createIncidentInvoice(@RequestPart("incidentInvoiceRequest") IncidentInvoiceRequest incidentInvoiceRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api createIncidentInvoice ");
        try {
            var incidentInvoice = modelMapper.map(incidentInvoiceRequest.getIncidentInvoiceDTO(), IncidentInvoice.class);
            var added = incidentInvoiceService.addIncidentInvoice(incidentInvoice,
                    incidentInvoiceRequest.getOrderId(), incidentInvoiceRequest.getDriverId(), file);
            return new ResponseEntity<>(added.values(), HttpStatusCode.valueOf(added.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error creating IncidentInvoice:", e);
            return ResponseEntity.badRequest().body("Tạo mới lỗi hóa đơn sự cố : " + e.getMessage());
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<?> editIncidentInvoice(@RequestPart("incidentInvoiceRequest") IncidentInvoiceRequest incidentInvoiceRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api editContainerTruck/ request: {} ", incidentInvoiceRequest);
        try {
            var incidentInvoice = modelMapper.map(incidentInvoiceRequest.getIncidentInvoiceDTO(), IncidentInvoice.class);
            var edited = incidentInvoiceService.editIncidentInvoice(incidentInvoice, incidentInvoiceRequest.getOrderId(), incidentInvoiceRequest.getDriverId(), file);
            log.info("Edit success IncidentInvoiceId : {} ", incidentInvoiceRequest.getIncidentInvoiceDTO().getIncidentInvoiceId());
            return new ResponseEntity<>(edited.values(), HttpStatusCode.valueOf(edited.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error updating :", e);
            return ResponseEntity.badRequest().body("Sửa hóa đơn bị lỗi : " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (ExcelHelper.hasExcelFormat(file)) {
            try {
                var upload = excelService.saveExcel(file, Constants.Invoice.INCIDENT);
                return new ResponseEntity<>(upload.values(), HttpStatusCode.valueOf(upload.keySet().iterator().next()));
            } catch (Exception e) {
                log.error("Error upload:", e);
                return ResponseEntity.badRequest().body("Lỗi thêm mới hóa đơn sự cố: " + e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body("Lỗi thêm mới hóa đơn sự cố !");
    }

    @GetMapping("/download")
    public ResponseEntity<?> exportFile() {
        LocalDate currentDate = LocalDate.now();
        String filename = ExcelHelper.FILE_NAME_FOR_INCIDENT + currentDate.toString() + ".xlsx";
        ByteArrayResource file = new ByteArrayResource(excelService.exportToFile(Constants.Invoice.INCIDENT).toByteArray());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(file);
    }
}
