package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.RepairInvoiceDTO;
import vn.fpt.edu.ctms.dto.request.RepairInvoiceRequest;
import vn.fpt.edu.ctms.dto.response.RepairInvoiceResponse;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.RepairInvoice;
import vn.fpt.edu.ctms.repository.RepairInvoiceRepository;
import vn.fpt.edu.ctms.specification.RepairInvoiceSpecification;
import vn.fpt.edu.ctms.util.FileUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RepairInvoiceService {

    private final BlobService blobService;

    private final RepairInvoiceRepository repairInvoiceRepository;

    private final ModelMapper modelMapper;

    private final FileUtils fileUtils;

    public HashMap<String, Object> getRepairInvoiceByCriteria(RepairInvoiceDTO repairInvoiceDTO, ContainerTruckDTO containerTruckDTO
            , int page, int pageSize) {
        log.info("RepairInvoiceService Service / getRepairInvoiceByCriteria");
        RepairInvoice repairInvoice = modelMapper.map(repairInvoiceDTO, RepairInvoice.class);
        ContainerTruck containerTruck = modelMapper.map(containerTruckDTO, ContainerTruck.class);
        Pageable paging = PageRequest.of(page, pageSize);
        Specification<RepairInvoice> spec = RepairInvoiceSpecification.filterRepairInvoiceByAllFields(repairInvoice, containerTruck);
        var repairInvoicePg = repairInvoiceRepository.findAll(spec, paging);
        HashMap<String, Object> resp = new HashMap<>();
        resp.put("repairInvoices", repairInvoicePg.getContent().stream()
                .map(item -> {
                    return modelMapper.map(item, RepairInvoiceResponse.class);
                })
                .collect(Collectors.toList()));
        resp.put("totalPage", repairInvoicePg.getTotalPages());
        return resp;
    }

    @Transactional
    public HashMap<Integer, List<String>> addRepairInvoice(RepairInvoice repairInvoice, String truckId, MultipartFile file) {
        log.info("RepairInvoiceService / addRepairInvoice");
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            List<String> errors = validateRepairInvoice(repairInvoice);
            if (!errors.isEmpty()) {
                status.put(Constants.StatusCode.DUPLICATE, errors);
                log.info("Invalid incident invoice request: " + String.join(", ", errors));
                return status;
            }
            //upload file
            if (file != null) {
                String path = "invoice/repair/" + repairInvoice.getInvoiceNumber() + "/" + file.getOriginalFilename();
                blobService.uploadMultipart(path, file);
            }
            if (truckId != null || truckId.equals("")) {
                ContainerTruck containerTruck = new ContainerTruck();
                containerTruck.setTruckId(truckId);
                repairInvoice.setTruck(containerTruck);
            }
            repairInvoiceRepository.save(repairInvoice);
            status.put(Constants.StatusCode.SUCCESS, new ArrayList<>(List.of("Tạo hóa đơn sửa chữa thành công !")));
        } catch (Exception ex) {
            log.error(ex.getMessage());
        }
        return status;
    }

    @Transactional
    public HashMap<Integer, List<String>> editRepairInvoice(RepairInvoice repairInvoice, String truckId, MultipartFile file) {
        log.info("RepairInvoiceService / editRepairInvoice");
        HashMap<Integer, List<String>> status = new HashMap<>();
        var repairInvoiceOptional = repairInvoiceRepository.
                findRepairInvoiceByRepairInvoiceId(repairInvoice.getRepairInvoiceId());
        log.info("data : {}", repairInvoiceOptional);
        repairInvoiceOptional.ifPresent(
                repairInvoices -> {
                    //check whether delete or upload file
                    if (file != null && !file.isEmpty()) {
                        String path = "invoice/repair/" + repairInvoice.getInvoiceNumber() + "/" + file.getOriginalFilename();
                        blobService.uploadMultipart(path, file);
                    }
                    if (StringUtils.isNotEmpty(repairInvoices.getAttach())
                            && StringUtils.isEmpty(repairInvoice.getAttach())) {
                        blobService.deleteInvoiceFile(
                                repairInvoices.getAttach(),
                                Constants.Invoice.REPAIR,
                                repairInvoices.getRepairInvoiceId(),
                                repairInvoices.getInvoiceNumber());
                    }
                    repairInvoices = modelMapper.map(repairInvoice,RepairInvoice.class);
                    if (StringUtils.isNotEmpty(truckId)) {
                        ContainerTruck containerTruck = new ContainerTruck();
                        containerTruck.setTruckId(truckId);
                        repairInvoices.setTruck(containerTruck);
                    }
                    repairInvoiceRepository.save(repairInvoices);
                    log.info("editRepairInvoice {} success", repairInvoices);
                    status.put(Constants.StatusCode.SUCCESS
                            , new ArrayList<>(List.of("Sửa hóa đơn sửa chữa thành công !")));
                }
        );
        return status;
    }

    public List<String> validateRepairInvoice(RepairInvoice repairInvoice) {
        List<String> errors = new ArrayList<>();
        if (checkInvoiceNumberExist(repairInvoice.getInvoiceNumber())) {
            errors.add("Số hóa đơn đã tồn tại.");
        }
        return errors;
    }

    public Boolean checkInvoiceNumberExist(String invoiceNumber) {
        boolean isExist = false;
        if (repairInvoiceRepository.existsByInvoiceNumber(invoiceNumber)) {
            isExist = true;
        }
        return isExist;
    }

}
