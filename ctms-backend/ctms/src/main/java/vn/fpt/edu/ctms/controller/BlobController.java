package vn.fpt.edu.ctms.controller;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.service.BlobService;

import java.io.IOException;

@RestController
@RequestMapping("/api/blob")
@RequiredArgsConstructor
@Slf4j
public class BlobController {
    private final BlobService blobService;

    @PostMapping("/upload")
    public ResponseEntity<String> upload(MultipartFile file) throws IOException {
        return ResponseEntity.ok(blobService.uploadToBlob(file.getOriginalFilename(), file.getInputStream(), (int) file.getSize()));
    }

    @GetMapping("/download")
    public ResponseEntity<Resource> download(@RequestParam String filename) {
        try {
            var resource = blobService.downloadBlob(filename);
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .headers(headers)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(Constants.StatusCode.DOWNLOAD_FILE_FAILED).build();
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam String filename) {
        log.info("BlobController/delete file {}", filename);
        try {
            blobService.deleteBlob(filename);
            return ResponseEntity.ok("Delete file successful!");
        } catch (Exception e) {
            return ResponseEntity.status(Constants.StatusCode.DELETE_FILE_FAILED).body("Delete file failed");

        }
    }

    @DeleteMapping("/delete/invoice")
    public ResponseEntity<String> deleteInvoiceFile
            (@NotNull @RequestParam String filename,
             @NotNull @RequestParam String invoiceType,
             @NotNull @RequestParam String invoiceId) {
        log.info("BlobController/delete {} invoice, filename: {}", invoiceType, filename);
        try {
            //blobService.deleteInvoiceFile(filename, invoiceType, invoiceId);
            return ResponseEntity.ok("Delete file successful!");
        } catch (Exception e) {
            return ResponseEntity.status(Constants.StatusCode.DELETE_FILE_FAILED).body("Delete file failed");

        }
    }
}
