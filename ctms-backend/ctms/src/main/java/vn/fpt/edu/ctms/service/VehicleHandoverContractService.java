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
import vn.fpt.edu.ctms.dto.UserDTO;
import vn.fpt.edu.ctms.dto.VehicleHanoverContractDTO;
import vn.fpt.edu.ctms.dto.request.VehicleHandoverContractRequest;
import vn.fpt.edu.ctms.dto.response.VehicleHandoverContractResponse;
import vn.fpt.edu.ctms.model.ContainerTruck;
import vn.fpt.edu.ctms.model.User;
import vn.fpt.edu.ctms.model.VehicleHandoverContract;
import vn.fpt.edu.ctms.repository.VehicleHandoverContractRepository;
import vn.fpt.edu.ctms.specification.VehicleHandoverContractSpecification;
import vn.fpt.edu.ctms.util.FileUtils;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VehicleHandoverContractService {
    private final BlobService blobService;
    private final VehicleHandoverContractRepository vehicleHandoverContractRepository;
    private final FileUtils fileUtils;
    private final ModelMapper modelMapper;

    @Transactional
    public HashMap<String, Object> getVehicalHandoverContractByCriteria(VehicleHanoverContractDTO vehicleHanoverContractDTO, ContainerTruckDTO containerTruckDTO
            , UserDTO userDTO, int page, int pageSize) {
        log.info("VehicalHandoverContractService / getVehicalHandoverContractByCriteria");
        VehicleHandoverContract vehicleHandoverContract = modelMapper.map(vehicleHanoverContractDTO, VehicleHandoverContract.class);
        ContainerTruck containerTruck = modelMapper.map(containerTruckDTO, ContainerTruck.class);
        User user = modelMapper.map(userDTO, User.class);
        Pageable paging = PageRequest.of(page, pageSize);
        Specification<VehicleHandoverContract> spec = VehicleHandoverContractSpecification.filterVehicalHandoverContractByAllFields(vehicleHandoverContract, containerTruck, user);
        var vehicalHandoverContractPag = vehicleHandoverContractRepository.findAll(spec, paging);
        HashMap<String, Object> resp = new HashMap<>();
        resp.put("vehicalHandoverContracts", vehicalHandoverContractPag.getContent().stream()
                .map(item -> {
                    log.info("Mapping vehicalHandoverContract entity to vehicalHandoverContractResponse : {}", item);
                    VehicleHandoverContractResponse vehicleHandoverContractResponseResp = modelMapper.map(item, VehicleHandoverContractResponse.class);
                    log.info("Mapped VehicalHandoverContractResponse: {}", vehicleHandoverContractResponseResp);
                    return vehicleHandoverContractResponseResp;
                })
                .collect(Collectors.toList()));
        resp.put("totalPage", vehicalHandoverContractPag.getTotalPages());
        return resp;

    }

    @Transactional
    public HashMap<Integer, List<String>> addVehicalHandoverContract(VehicleHandoverContract vehicleHanoverContract,
                                                                     String truckId, String userId, MultipartFile file) {
        log.info("VehicalHandoverContractService / addVehicalHandoverContract");
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            List<String> errors = validateVehicleHandOverContract(vehicleHanoverContract);
            if (!errors.isEmpty()) {
                status.put(Constants.StatusCode.DUPLICATE, errors);
                log.info("Invalid Vehical Handover Contract  request: " + String.join(", ", errors));
                return status;
            }
            List<String> checkDate = validateDateVehicleHandOverContract(vehicleHanoverContract);
            if (!checkDate.isEmpty()) {
                status.put(Constants.StatusCode.INPUT_DATE_ERROR, errors);
                log.info("Invalid Vehical Handover Contract  request: " + String.join(", ", errors));
                return status;
            }
            //upload file
            if (file != null) {
                String path = "contract/handover/" + vehicleHanoverContract.getContractNumber() + "/" + file.getOriginalFilename();
                blobService.uploadMultipart(path, file);
            }
            if (Objects.nonNull(vehicleHanoverContract)) {
                if (StringUtils.isNotEmpty(truckId)) {
                    ContainerTruck containerTruck = new ContainerTruck();
                    containerTruck.setTruckId(truckId);
                    vehicleHanoverContract.setTruck(containerTruck);
                }
                if (StringUtils.isNotEmpty(userId)) {
                    User user = new User();
                    user.setUserId(userId);
                    vehicleHanoverContract.setDriver(user);
                }
                vehicleHandoverContractRepository.save(vehicleHanoverContract);
                status.put(Constants.StatusCode.SUCCESS, new ArrayList<String>(Arrays.asList("Tạo hợp đồng thành công !")));
            }
        } catch (Exception ex) {
            log.error(ex.getMessage());
        }
        return status;
    }

    @Transactional
    public HashMap<Integer, List<String>> editVehicleHandoverContract(VehicleHandoverContract handoverContractRequest, String truckId, String userId, MultipartFile file) {
        log.info("editVehicleHandoverContractService / editVehicleHandoverContract");
        HashMap<Integer, List<String>> status = new HashMap<>();
        var vehicalHandoverContractOptional = vehicleHandoverContractRepository.
                findById(handoverContractRequest.getHandingContractId());
        log.info("data : {}", vehicalHandoverContractOptional);
        vehicalHandoverContractOptional.ifPresent(
                vehicleHandoverContract -> {
                    //check whether delete or upload file
                    if (file != null && !file.isEmpty()) {
                        String path = "contract/handover/" + handoverContractRequest.getContractNumber() + "/" + file.getOriginalFilename();
                        blobService.uploadMultipart(path, file);
                    }
                    if (StringUtils.isNotEmpty(vehicleHandoverContract.getAttach())
                            && StringUtils.isEmpty(handoverContractRequest.getAttach())) {
                        blobService.deleteInvoiceFile(
                                vehicleHandoverContract.getAttach(),
                                Constants.Contract.VEHICLE_HANDOVER,
                                vehicleHandoverContract.getHandingContractId(),
                                vehicleHandoverContract.getContractNumber());
                    }
                    if (StringUtils.isNotEmpty(truckId)) {
                        ContainerTruck containerTruck = new ContainerTruck();
                        containerTruck.setTruckId(truckId);
                        vehicleHandoverContract.setTruck(containerTruck);
                    }
                    if (StringUtils.isNotEmpty(userId)) {
                        User user = new User();
                        user.setUserId(userId);
                        vehicleHandoverContract.setDriver(user);
                    }
                    vehicleHandoverContractRepository.save(vehicleHandoverContract);
                    log.info("editVehicleHandoverContract {} success", vehicleHandoverContract);
                    status.put(Constants.StatusCode.SUCCESS
                            , new ArrayList<>(List.of("Sửa hợp đồng thành công !")));
                }
        );
        return status;
    }

    public List<String> validateVehicleHandOverContract(VehicleHandoverContract vehicleHandoverContract) {
        List<String> errors = new ArrayList<>();
        if (checkContractNumberExist(vehicleHandoverContract.getContractNumber())) {
            errors.add("Số hóa đơn đã tồn tại.");
        }
        return errors;
    }

    public List<String> validateDateVehicleHandOverContract(VehicleHandoverContract vehicleHandoverContract) {
        List<String> errors = new ArrayList<>();
        if (vehicleHandoverContract.getStartDate().isBefore(LocalDate.of(2000, 1, 1))) {
            errors.add("Ngày bắt đầu không được nhỏ hơn 1/1/2000");
        }
        if (vehicleHandoverContract.getStartDate().isAfter(vehicleHandoverContract.getEndDate())) {
            errors.add("Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }
        return errors;
    }

    public Boolean checkContractNumberExist(String contractNumber) {
        Boolean isExist = false;
        if (vehicleHandoverContractRepository.existsByContractNumber(contractNumber)) {
            isExist = true;
        }
        return isExist;
    }

}
