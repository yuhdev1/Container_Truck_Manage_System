package vn.fpt.edu.ctms.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobItem;
import jakarta.mail.Multipart;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.repository.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlobService {

    private final BlobServiceClient blobServiceClient;
    private final RepairInvoiceRepository repairInvoiceRepository;
    private final OrderInvoiceRepository orderInvoiceRepository;
    private final IncidentInvoiceRepository incidentInvoiceRepository;
    private final ContainerTruckRepository containerTruckRepository;

    private final TransportationContractRepository transportationContractRepository;


    @Value("${azure.storage.blob.container-name}")
    private String containerName;

    @Value("${azure.storage.blob.connection-string}")
    private String connectionString;

    public List<String> listBlobs() {
        List<String> blobNames = new ArrayList<>();
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        for (BlobItem blobItem : containerClient.listBlobs()) {
            blobNames.add(blobItem.getName());
        }
        return blobNames;
    }

    public String uploadToBlob(String blobName, InputStream file, long size) {
        log.info("Upload file to Blob, filename: " + blobName);
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        blobClient.upload(file, size, true);
        return blobClient.getBlobName();
    }

    public boolean uploadBase64(String blobName, String base64) {
        if (StringUtils.isNotEmpty(base64)) {
            byte[] decodedFile = Base64.getMimeDecoder().decode(base64.getBytes(StandardCharsets.UTF_8));
            ByteArrayInputStream is = new ByteArrayInputStream(decodedFile);
            uploadToBlob(blobName, is, decodedFile.length);
            return true;
        }
        return false;
    }

    public void uploadFile(String attach, MultipartFile file, String prefix) {
        if (StringUtils.isNotEmpty(attach) && file != null && !file.isEmpty()) {
            String path = prefix + file.getOriginalFilename();
            uploadMultipart(path, file);
        }
    }

    public void uploadMultipart(String blobName, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            try {
                uploadToBlob(blobName, file.getInputStream(), file.getSize());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public Resource downloadBlob(String blobName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        blobClient.downloadStream(os);
        final byte[] bytes = os.toByteArray();
        return new ByteArrayResource(bytes);
    }

    public boolean deleteBlob(String blobName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        var client = containerClient.getBlobClient(blobName);
        return client.deleteIfExists();
    }

    public void deleteInvoiceFile(String filename, String type, String invoiceId, String invoiceNumber) {
        String path = "invoice/";
        if (StringUtils.isEmpty(filename) || StringUtils.isEmpty(type) || StringUtils.isEmpty(invoiceId)) return;
        path += type.toLowerCase() + "/" + invoiceNumber + "/" + filename;
        if (deleteBlob(path)) {
            switch (type) {
                case Constants.Invoice.REPAIR -> repairInvoiceRepository
                        .findRepairInvoiceByRepairInvoiceId(invoiceId)
                        .ifPresent(invoice -> invoice.setAttach(""));
                case Constants.Invoice.ORDER -> orderInvoiceRepository
                        .findOrderInvoiceByOrderInvoiceId(invoiceId)
                        .ifPresent(invoice -> invoice.setAttach(""));
                case Constants.Invoice.INCIDENT -> incidentInvoiceRepository
                        .findIncidentInvoiceByIncidentInvoiceId(invoiceId)
                        .ifPresent(invoice -> invoice.setAttach(""));
            }
        }
    }

    public void deleteContractFile(String filename, String type, String contractId, String contractNumber) {
        String path = "contract/";
        if (StringUtils.isEmpty(filename) || StringUtils.isEmpty(type) || StringUtils.isEmpty(contractId)) return;
        path += type.toLowerCase() + "/" + contractNumber + "/" + filename;
        if (deleteBlob(path)) {
            switch (type) {
//                case Constants.Contract.VEHICLE_HANDOVER -> repairInvoiceRepository
//                        .findRepairInvoiceByRepairInvoiceId(invoiceId)
//                        .ifPresent(invoice -> invoice.setAttach(""));
                case Constants.Contract.TRANSPORTATION -> transportationContractRepository
                        .findById(contractId)
                        .ifPresent(invoice -> invoice.setAttach(""));

            }
        }
    }


    public void deleteContainerFile(String blobName, String containerId) {
        if (StringUtils.isEmpty(blobName)) return;
        if (deleteBlob(blobName)) {
            containerTruckRepository.findContainerTruckByTruckId(containerId)
                    .ifPresent(truck -> truck.setAttach(""));
        }
    }
}
