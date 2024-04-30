package vn.fpt.edu.ctms.service;

import lombok.AllArgsConstructor;
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
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.OrderInvoiceDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.dto.request.OrderInvoiceRequest;
import vn.fpt.edu.ctms.dto.response.OrderInvoiceResponse;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.OrderInvoice;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.repository.OrderInvoiceRepository;
import vn.fpt.edu.ctms.specification.OrderInvoiceSpecification;
import vn.fpt.edu.ctms.util.FileUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderInvoiceService {
    private final OrderInvoiceRepository orderInvoiceRepository;
    private final ModelMapper modelMapper;
    private final FileUtils fileUtils;
    private final BlobService blobService;

    @Transactional
    public HashMap<String, Object> getOrderInvoiceByCriteria(OrderInvoiceDTO orderInvoiceDTO, OrderDTO orderDTO
            , UserDTO userDTO, int page, int pageSize) {
        log.info("OrderInvoiceService / getOrderInvoiceByCriteria");
        OrderInvoice orderInvoice = modelMapper.map(orderInvoiceDTO, OrderInvoice.class);
        Order order = modelMapper.map(orderDTO, Order.class);
        User user = modelMapper.map(userDTO, User.class);
        Pageable paging = PageRequest.of(page, pageSize);
        Specification<OrderInvoice> spec = OrderInvoiceSpecification.filterOrderInvoiceByAllFields(orderInvoice, order, user);
        var orderInvoicePg = orderInvoiceRepository.findAll(spec, paging);
        HashMap<String, Object> resp = new HashMap<>();
        resp.put("orderInvoices", orderInvoicePg.getContent().stream()
                .map(item -> {
                    OrderInvoiceResponse orderResp = modelMapper.map(item, OrderInvoiceResponse.class);
                    return orderResp;
                })
                .collect(Collectors.toList()));
        resp.put("totalPage", orderInvoicePg.getTotalPages());
        return resp;
    }

    @Transactional
    public HashMap<Integer, List<String>> addOrderInvoice(OrderInvoice orderInvoice,
                                                          String orderId, String customerId, MultipartFile file) {
        log.info("OrderInvoiceService / addOrderInvoice");
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            List<String> errors = validateOrderInvoice(orderInvoice);
            if (!errors.isEmpty()) {
                status.put(Constants.StatusCode.DUPLICATE, errors);
                log.info("Invalid incident invoice request: " + String.join(", ", errors));
                return status;
            }
            //upload file
            if (file != null) {
                String path = "invoice/order/" + orderInvoice.getInvoiceNumber() + "/" + file.getOriginalFilename();
                blobService.uploadMultipart(path, file);
            }
            if (Objects.nonNull(orderInvoice)) {
                if (StringUtils.isNotEmpty(orderId)) {
                    Order order = new Order();
                    order.setOrderId(orderId);
                    orderInvoice.setOrder(order);
                }
                if (StringUtils.isNotEmpty(customerId)) {
                    User cus = new User();
                    cus.setUserId(customerId);
                    orderInvoice.setCustomer(cus);
                }
                orderInvoiceRepository.save(orderInvoice);
                log.info("save invoice {} success", orderInvoice);
                status.put(Constants.StatusCode.SUCCESS, new ArrayList<String>(Arrays.asList("Tạo hóa đơn mua hàng thành công !")));
            }
        } catch (Exception ex) {
            log.error(ex.getMessage());
        }
        return status;
    }

    @Transactional
    public HashMap<Integer, List<String>> editOrderInvoice(OrderInvoice orderInvoice,
                                                           String orderId, String customerId, MultipartFile file) {
        log.info("IncidentInvoiceService / editIncidentInvoice");
        HashMap<Integer, List<String>> status = new HashMap<>();
        var orderInvoiceOptional = orderInvoiceRepository.
                findOrderInvoiceByOrderInvoiceId(orderInvoice.getOrderInvoiceId());
        log.info("data : {}", orderInvoiceOptional);
        orderInvoiceOptional.ifPresent(
                orderInvoices -> {
                    //check whether delete or upload file
                    if (file != null && !file.isEmpty()) {
                        String path = "invoice/order/" + orderInvoice.getInvoiceNumber() + "/" + file.getOriginalFilename();
                        blobService.uploadMultipart(path, file);
                    }
                    if (StringUtils.isNotEmpty(orderInvoices.getAttach())
                            && StringUtils.isEmpty(orderInvoice.getAttach())) {
                        blobService.deleteInvoiceFile(
                                orderInvoices.getAttach(),
                                Constants.Invoice.ORDER,
                                orderInvoices.getOrderInvoiceId(),
                                orderInvoices.getInvoiceNumber());
                    }
                    orderInvoices = modelMapper.map(orderInvoice, OrderInvoice.class);
                    if (StringUtils.isNotEmpty(orderId)) {
                        Order order = new Order();
                        order.setOrderId(orderId);
                        orderInvoices.setOrder(order);
                    }
                    if (StringUtils.isNotEmpty(customerId)) {
                        User user = new User();
                        user.setUserId(customerId);
                        orderInvoices.setCustomer(user);
                    }
                    orderInvoiceRepository.save(orderInvoices);
                    log.info("editOrderInvoice {} success", orderInvoices);
                    status.put(Constants.StatusCode.SUCCESS, new ArrayList<String>(Arrays.asList("Sửa hóa đơn mua hàng thành công !")));
                }
        );
        return status;
    }

    public List<String> validateOrderInvoice(OrderInvoice orderInvoice) {
        List<String> errors = new ArrayList<>();
        if (checkInvoiceNumberExist(orderInvoice.getInvoiceNumber())) {
            errors.add("Mã số đơn hàng đã tồn tại.");
        }
        return errors;
    }

    public Boolean checkInvoiceNumberExist(String invoiceNumber) {
        Boolean isExist = false;
        if (orderInvoiceRepository.existsByInvoiceNumber(invoiceNumber)) {
            isExist = true;
        }
        return isExist;
    }

}
