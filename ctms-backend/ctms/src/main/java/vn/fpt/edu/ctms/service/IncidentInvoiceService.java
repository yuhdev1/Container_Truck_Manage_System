package vn.fpt.edu.ctms.service;

import com.amazonaws.services.kms.model.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.*;
import vn.fpt.edu.ctms.dto.request.IncidentInvoiceRequest;
import vn.fpt.edu.ctms.dto.response.IncidentInvoiceResponse;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.IncidentInvoiceRepository;
import vn.fpt.edu.ctms.specification.IncidentInvoiceSpecification;
import vn.fpt.edu.ctms.util.FileUtils;


import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentInvoiceService {
    private final FileUtils fileUtils;

    private final BlobService blobService;

    private final IncidentInvoiceRepository incidentInvoiceRepository;
    private final UserService userService;
    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public HashMap<String, Object> getIncidentInvoiceByCriteria(IncidentInvoiceDTO incidentInvoiceDTO, OrderDTO orderDTO
            , UserDTO userDTO, int page, int pageSize) {
        log.info("IncidentInvoiceService Service / getIncidentInvoiceByCriteria");
        IncidentInvoice incidentInvoice = modelMapper.map(incidentInvoiceDTO, IncidentInvoice.class);
        Order order = modelMapper.map(orderDTO, Order.class);
        User user = modelMapper.map(userDTO, User.class);
        Pageable paging = PageRequest.of(page, pageSize);
        Specification<IncidentInvoice> spec = IncidentInvoiceSpecification.filterIncidentInvoiceByAllFields(incidentInvoice, order, user);
        var incidentInvoicePg = incidentInvoiceRepository.findAll(spec, paging);
        HashMap<String, Object> resp = new HashMap<>();
        resp.put("incidentInvoices", incidentInvoicePg.getContent().stream()
                .map(item -> {
                    IncidentInvoiceResponse incidentResp = modelMapper.map(item, IncidentInvoiceResponse.class);
                    return incidentResp;
                })
                .collect(Collectors.toList()));
        resp.put("totalPage", incidentInvoicePg.getTotalPages());
        return resp;
    }

    @Transactional
    public HashMap<Integer, List<String>> addIncidentInvoice(IncidentInvoice invoice,
                                                             String orderId, String driverId, MultipartFile file) {
        log.info("IncidentInvoiceService / addIncidentInvoice");

        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            List<String> errors = validateIncidentInvoice(invoice);
            if (!errors.isEmpty()) {
                status.put(Constants.StatusCode.DUPLICATE, errors);
                log.info("Invalid incident invoice request: " + String.join(", ", errors));
                return status;
            }
//            if(!userService.checkIsDriver(driverId)){
//                throw new NotFoundException("Tài xế không tồn tại");
//            }
            //upload file
            if (file != null) {
                String path = "invoice/incident/" + invoice.getInvoiceNumber() + "/" + file.getOriginalFilename();
                blobService.uploadMultipart(path, file);
            }
            if (Objects.nonNull(invoice)) {
                if (StringUtils.isNotEmpty(orderId)) {
                    Order order = new Order();
                    order.setOrderId(orderId);
                    invoice.setOrder(order);
                }
                if (StringUtils.isNotEmpty(driverId)) {
                    User driver = new User();
                    driver.setUserId(driverId);
                    invoice.setDriver(driver);
                }
                incidentInvoiceRepository.save(invoice);
                log.info("save invoice {} success", invoice);
                status.put(Constants.StatusCode.SUCCESS, new ArrayList<String>(Arrays.asList("Tạo mới hóa đơn thành công !")));
            }
        } catch (Exception ex) {
            log.error(ex.getMessage());
        }
        return status;
    }

    @Transactional
    public HashMap<Integer, List<String>> editIncidentInvoice(IncidentInvoice invoice,
                                                              String orderId, String driverId, MultipartFile file) {
        log.info("IncidentInvoiceService / editIncidentInvoice");
        HashMap<Integer, List<String>> status = new HashMap<>();
        var incidentInvoiceOptional = incidentInvoiceRepository.
                findIncidentInvoiceByIncidentInvoiceId(invoice.getIncidentInvoiceId());
        log.info("data : {}", incidentInvoiceOptional);
//        if(!userService.checkIsDriver(driverId)){
//            throw new NotFoundException("Tài xế không tồn tại");
//        }
        incidentInvoiceOptional.ifPresent(
                incidentInvoice -> {
                    //check whether delete or upload file
                    if (file != null && !file.isEmpty()) {
                        String path = "invoice/incident/" + invoice.getInvoiceNumber() + "/" + file.getOriginalFilename();
                        blobService.uploadMultipart(path, file);
                    }
                    if (StringUtils.isNotEmpty(incidentInvoice.getAttach())
                            && StringUtils.isEmpty(invoice.getAttach())) {
                        blobService.deleteInvoiceFile(
                                incidentInvoice.getAttach(),
                                Constants.Invoice.INCIDENT,
                                incidentInvoice.getIncidentInvoiceId(),
                                incidentInvoice.getInvoiceNumber());
                    }
                    incidentInvoice = modelMapper.map(invoice,IncidentInvoice.class);
                    if (StringUtils.isNotEmpty(driverId)) {
                        User user = new User();
                        user.setUserId(driverId);
                        incidentInvoice.setDriver(user);
                    }
                    if (StringUtils.isNotEmpty(orderId)) {
                        Order order = new Order();
                        order.setOrderId(orderId);
                        incidentInvoice.setOrder(order);
                    }

                    incidentInvoiceRepository.save(incidentInvoice);
                    log.info("editIncidentInvoice {} success", incidentInvoice);
                    status.put(Constants.StatusCode.SUCCESS, new ArrayList<String>(Arrays.asList("Sửa hóa đơn thành công !")));
                }
        );
        return status;
    }

    public List<String> validateIncidentInvoice(IncidentInvoice incidentInvoice) {
        List<String> errors = new ArrayList<>();
        if (checkInvoiceNumberExist(incidentInvoice.getInvoiceNumber())) {
            errors.add("Số hóa đơn đã tồn tại.");
        }
        return errors;
    }



    public Boolean checkInvoiceNumberExist(String invoiceNumber) {
        Boolean isExist = false;
        if (incidentInvoiceRepository.existsByInvoiceNumber(invoiceNumber)) {
            isExist = true;
        }
        return isExist;
    }
}
