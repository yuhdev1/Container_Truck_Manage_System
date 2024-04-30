package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.fpt.edu.ctms.constant.Constants;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.TransportationContractDTO;
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.NullPointerExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.TransportationContractRepository;
import vn.fpt.edu.ctms.specification.TransportationContractSpecification;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class TransportationContractService {

    private final TransportationContractRepository transportationContractRepository;

    private final UserService userService;

    private final OrderService orderService;

    private final NotificationService notificationService;

    private final BlobService blobService;

    private final DriverScheduleService driverScheduleService;


    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public Page<TransportationContract> getPurchaseContractByCriteria(TransportationContractDTO purchaseContract, Pageable pageable) {
        Specification<TransportationContract> spec = TransportationContractSpecification.filterByAllFields(purchaseContract);
        return transportationContractRepository.findAll(spec, pageable);
    }


    @Transactional
    public TransportationContract createTransportationContract(TransportationContractDTO transportationContractDTO, MultipartFile file) {
        List<String> errors = validateTransportationContractRequest(transportationContractDTO);
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Invalid  request: " + String.join(", ", errors));
        }
        TransportationContract contract = modelMapper.map(transportationContractDTO, TransportationContract.class);
        //upload file
        if (file != null && !file.isEmpty()) {
            String path = "contract/transportation/" + transportationContractDTO.getContractNumber() + "/" + file.getOriginalFilename();
            blobService.uploadMultipart(path, file);
            contract.setAttach(file.getOriginalFilename());
        }
        Order order = Order.builder()
                .customer(contract.getCustomer())
                .orderNumber(orderService.generateOrderNumber())
                .status(Status.PENDING)
                .eta(contract.getEta())
                .etd(contract.getEtd())
                .shippingAddress(contract.getShippingAddress())
                .deliveryAddress(contract.getDeliveryAddress())
                .requestedDeliveryDate(contract.getRequestedDeliveryDate())
                .price(contract.getTotalPrice() - contract.getDeposit())
                .paid(false)
                .build();
        orderService.save(order);

        Notification notification = Notification.builder()
                .customer(contract.getCustomer())
                .order(order)
                .content("Đơn hàng " + order.getOrderNumber() + " đã được tạo thành công")
                .timestamp(LocalDateTime.now().toString())
                .receiver(contract.getCustomer().getUserNumber())
                .seen(false)
                .build();
        notificationService.save(notification);

        notificationService.sendNotification(notification);

        contract.setOrder(order);


        return transportationContractRepository.save(contract);
    }


    public List<String> validateTransportationContractRequest(TransportationContractDTO contractDTO) {
        List<String> errors = new ArrayList<>();


        if (Objects.isNull(contractDTO.getEtd())) {
            throw new NullPointerExc("etd  can't be null!");
        }

        if (Objects.isNull(contractDTO.getEta())) {
            throw new NullPointerExc("eta  can't be null!");
        }
        if (Objects.isNull(contractDTO.getRequestedDeliveryDate())) {
            throw new NullPointerExc("request delivery date can't be null!");
        }

        if (StringUtils.isEmpty(contractDTO.getShippingAddress())) {
            throw new NullPointerExc("shipping address is required.");
        }
        if (StringUtils.isEmpty(contractDTO.getDeliveryAddress())) {
            throw new NullPointerExc("delivery address is required.");
        }
        if (Objects.isNull(contractDTO.getDeposit())) {
            throw new NullPointerExc("Deposit can't be null!");
        }
        if (Objects.isNull(contractDTO.getTotalPrice())) {
            throw new NullPointerExc("Total Price can't be null!");
        }

        if (StringUtils.isEmpty(contractDTO.getCustomerId())) {
            throw new NullPointerExc("customer is required.");
        } else {
            User customer = userService.findbyUserId(contractDTO.getCustomerId());
            if (customer == null) {
                throw new NotFoundExc("User not found.");
            } else if (customer.getRole() != Role.CUSTOMER) {
                throw new ValidationExc("Invalid CUSTOMER role.");
            } else {
                contractDTO.setCustomer(customer);
            }
        }


        return errors;
    }


    private <T> void updateFieldIfNotNull(T value, Consumer<T> updater) {
        if (value != null) {
            updater.accept(value);
        }
    }

    @Transactional
    public TransportationContract updateTransportationContract(String Id, TransportationContractDTO contractDTO,MultipartFile file) {
        TransportationContract contract = transportationContractRepository.findById(Id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + Id));

        if (file != null && !file.isEmpty() ) {
            String path = "contract/transportation/" + contract.getContractNumber() + "/" + file.getOriginalFilename();
            blobService.deleteContractFile(contract.getAttach(), Constants.Contract.TRANSPORTATION, contract.getId(), contract.getContractNumber());
            String filename = file.getOriginalFilename();
            blobService.uploadMultipart(path, file);
            contract.setAttach(filename);
        }
        Order order = orderService.findByOrderId(contract.getOrder().getOrderId());

        Optional<DriverSchedule> driverSchedule = driverScheduleService.findByOrderId(order.getOrderId());

        if(Objects.nonNull(contractDTO)){
            if(Objects.nonNull(contractDTO.getEta())){
                contract.setEta(contractDTO.getEta());
                order.setEta(contractDTO.getEta());
            }

            if(Objects.nonNull(contractDTO.getEtd())){
                contract.setEtd(contractDTO.getEtd());
                order.setEtd(contractDTO.getEtd());

            }

            if (contract.getEtd().after(contract.getEta())) {
                throw new RuntimeException("ETD cannot be greater than ETA");
            }

            if(driverSchedule.isPresent()) {

                driverSchedule.get().setFrom(null);
                driverSchedule.get().setTo(null);

                if (driverScheduleService.checkOverlap(contract.getEtd(), contract.getEta(), driverSchedule.get().getContainerTruck().getDriver().getUserId())) {
                    throw new ValidationExc("overlap with another driver schedule with id:" + driverSchedule.get().getContainerTruck().getDriver().getUserId());
                } else {
                    driverSchedule.get().setFrom(contract.getEtd());
                    driverSchedule.get().setTo(contract.getEta());
                }

            }



            updateFieldIfNotNull(contractDTO.getRequestedDeliveryDate(), date ->
            {
                contract.setRequestedDeliveryDate(date);
                order.setRequestedDeliveryDate(date);
            });

            updateFieldIfNotNull(contractDTO.getShippingAddress(), shippingAddress ->
            {
                contract.setShippingAddress(shippingAddress);
                order.setShippingAddress(shippingAddress);
            });

            updateFieldIfNotNull(contractDTO.getDeliveryAddress(), deliveryAddress ->
            {
                contract.setDeliveryAddress(deliveryAddress);
                order.setDeliveryAddress(deliveryAddress);
            });

            updateFieldIfNotNull(contractDTO.getDeposit(), deposit -> {
                contract.setDeposit(deposit);
                order.setPrice(contract.getTotalPrice() - deposit);
            });

            updateFieldIfNotNull(contractDTO.getTotalPrice(), totalPrice ->
                    {
                        contract.setTotalPrice(totalPrice);
                        order.setPrice(totalPrice - contract.getDeposit());
                    });



            updateFieldIfNotNull(contractDTO.getNote(), contract::setNote);


        }





        return transportationContractRepository.save(contract);
    }





}
