package vn.fpt.edu.ctms.controller;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.request.RepairInvoiceRequest;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.RepairInvoiceDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.dto.response.RepairInvoiceResponse;
import vn.fpt.edu.ctms.model.RepairInvoice;
import vn.fpt.edu.ctms.service.ExcelService;
import vn.fpt.edu.ctms.service.RepairInvoiceService;
import vn.fpt.edu.ctms.util.helper.ExcelHelper;

import java.time.LocalDate;
import java.util.Date;
import java.util.HashMap;

@RestController
@RequestMapping("/api/invoice/repair")
@RequiredArgsConstructor
@Slf4j
public class RepairInvoiceController {
    @Autowired
    private RepairInvoiceService repairInvoiceService;
    @Autowired
    private ModelMapper modelMapper;
    private final ExcelService excelService;

    @GetMapping("")
    public ResponseEntity<HashMap<String, Object>> getRepairInvoiceByCriteria(
            RepairInvoiceDTO repairInvoiceDTO,
            ContainerTruckDTO containerTruckDTO,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int pageSize

    ) {
        log.info("Calling api getRepairInvoiceByCriteria/ RepairInvoiceDTO: {} ,ContainerTruckDTO {}  ", repairInvoiceDTO, containerTruckDTO);
        return ResponseEntity.ok(repairInvoiceService.getRepairInvoiceByCriteria(repairInvoiceDTO, containerTruckDTO, page, pageSize));
    }

    @PostMapping(value = "add")
    public ResponseEntity<?> createRepairInvoice(@RequestPart("repairInvoiceRequest") RepairInvoiceRequest repairInvoiceRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        log.info("Calling api createRepairInvoice");
        try {
            var repairInvoice = modelMapper.map(repairInvoiceRequest.getRepairInvoiceDTO(), RepairInvoice.class);
            var added = repairInvoiceService.addRepairInvoice(repairInvoice, repairInvoiceRequest.getTruckId(), file);
            log.info("Added success : {} ", added);
            return new ResponseEntity<>(added.values(), HttpStatusCode.valueOf(added.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error creating RepairInvoice:", e);
            return ResponseEntity.badRequest().body("Tạo mới lỗi hóa đơn sửa chữa : " + e.getMessage());
        }
    }

    @PostMapping(value = "/edit")
    public ResponseEntity<?> editRepairInvoice(@RequestPart("repairInvoiceRequest") RepairInvoiceRequest repairInvoiceRequest
            , @RequestPart("file") @Nullable MultipartFile file) {
        try {
            var repairInvoice = modelMapper.map(repairInvoiceRequest.getRepairInvoiceDTO(), RepairInvoice.class);
            var edited = repairInvoiceService.editRepairInvoice(repairInvoice, repairInvoiceRequest.getTruckId(), file);
            return new ResponseEntity<>(edited.values(), HttpStatusCode.valueOf(edited.keySet().iterator().next()));
        } catch (Exception e) {
            log.error("Error updating:", e);
            return ResponseEntity.badRequest().body("Lỗi sửa hóa đơn sửa chữa: " + e.getMessage());
        }
    }

    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadFile(@RequestPart("file") MultipartFile file) {
        if (ExcelHelper.hasExcelFormat(file)) {
            try {
                var upload = excelService.saveExcel(file, Constants.Invoice.REPAIR);
                return new ResponseEntity<>(upload.values(), HttpStatusCode.valueOf(upload.keySet().iterator().next()));
            } catch (Exception e) {
                log.error("Error upload:", e);
                return ResponseEntity.badRequest().body("Lỗi thêm mới hóa đơn sửa chữa: " + e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body("Lỗi thêm mới hóa đơn sửa chữa !");
    }
    @GetMapping("/download")
    public ResponseEntity<?> exportFile() {
        LocalDate currentDate = LocalDate.now();
        String filename = ExcelHelper.FILE_NAME_FOR_REPAIR + currentDate.toString() + ".xlsx";
        log.info(filename);
        ByteArrayResource file = new ByteArrayResource(excelService.exportToFile(Constants.Invoice.REPAIR).toByteArray());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.contentLength())
                .body(file);
    }


}
