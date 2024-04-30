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
import vn.fpt.edu.ctms.dto.response.ContainerTruckResponse;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.ContainerTruckRepository;
import vn.fpt.edu.ctms.repository.DriverScheduleRepository;
import vn.fpt.edu.ctms.repository.OrderRepository;
import vn.fpt.edu.ctms.specification.ContainerTruckSpecification;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContainerTruckService {

    private final ContainerTruckRepository containerTruckRepository;

    private final ModelMapper modelMapper;

    private final BlobService blobService;
    private final DriverScheduleRepository driverScheduleRepository;
    private final OrderRepository orderRepository;



    public HashMap<String, Object> getContainerTruckByCriteria(String truckId, String licensePlate, String manufacturer
            , Float capacity, Boolean isActive, String fullName, LocalDate registrationDate,Boolean inUse,String userNumber,String containerStatus, int page, int pageSize) {
        log.info("ContainerTruck Service / getContainerTruck");
        Pageable paging = PageRequest.of(page, pageSize);
        Specification<ContainerTruck> spec = ContainerTruckSpecification
                .filterContainerTruckByAllFields(truckId, licensePlate, manufacturer, capacity, isActive, fullName, registrationDate,inUse,userNumber,containerStatus);
        var containerTruckPg = containerTruckRepository.findAll(spec, paging);
        List<Order> scheduleList = new ArrayList<>();
        for(ContainerTruck truck :containerTruckPg){
            if(truck.getContainerStatus().equals(ContainerStatus.ACTIVE)){
                var order = orderRepository.findByContainerTruck_TruckIdAndStatus(truck.getTruckId(),Status.TOSHIP);
                if(order.isPresent()){
                    scheduleList.add(order.get());
                }
            }
        }
        HashMap<String, Object> resp = new HashMap<>();
        List<ContainerTruckResponse> contList = containerTruckPg.getContent().stream()
                .map(item -> modelMapper.map(item, ContainerTruckResponse.class))
                .collect(Collectors.toList());
        if(!scheduleList.isEmpty()){
            for(ContainerTruckResponse trucks : contList){
                if(trucks.getDriver() != null){
                    for (Order list : scheduleList){
                        if(trucks.getTruckId().equals(list.getContainerTruck().getTruckId())){
                            trucks.setOrderId(list.getOrderId());
                        }
                    }
                }

            }
        }
        resp.put("containerTrucks", contList);
        resp.put("totalPage", containerTruckPg.getTotalPages());
        return resp;
    }

    @Transactional
    public HashMap<Integer, List<String>> addContainerTruck(ContainerTruck containerTruck, MultipartFile file) {
        log.info("ContainerTruck Service / addContainerTruck");
        HashMap<Integer, List<String>> status = new HashMap<>();
        try {
            List<String> errors = validateContainerTruckRequest(containerTruck);
            if (!errors.isEmpty()) {
                status.put(Constants.StatusCode.DUPLICATE, errors);
                log.info("Invalid containerTruck request: " + String.join(", ", errors));
                return status;
            }
            //upload file
            if (file != null) {
                String path = "container/" + containerTruck.getLicensePlate() + "/" + containerTruck.getAttach();
                blobService.uploadMultipart(path, file);
            }
            containerTruck.setLicensePlate(containerTruck.getLicensePlate());
            containerTruck.setCapacity(containerTruck.getCapacity());
            containerTruck.setManufacturer(containerTruck.getManufacturer());
            containerTruck.setRegistrationDate(containerTruck.getRegistrationDate());
            containerTruck.setAttach(containerTruck.getAttach());
            containerTruck.setInUse(false);
            containerTruck.setContainerStatus(containerTruck.getContainerStatus());
            containerTruckRepository.save(containerTruck);
            log.info("save containerTruck {} success", containerTruck);
            status.put(Constants.StatusCode.SUCCESS, new ArrayList<String>(Arrays.asList("Tạo mới xe container thành công !")));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return status;

    }

    @Transactional
    public HashMap<Integer, List<String>> editContainerTruck(ContainerTruck editContainerRequest, MultipartFile file) {
        log.info("ContainerTruck Service / editContainerTruck");
        var containerTruckOptional =
                containerTruckRepository.findContainerTruckByTruckId(editContainerRequest.getTruckId());
        HashMap<Integer, List<String>> status = new HashMap<>();
        List<String> errors = validateContainerTruckEdit(editContainerRequest);
        if (!errors.isEmpty()) {
            status.put(Constants.StatusCode.DUPLICATE, errors);
            log.info("Invalid containerTruck request: " + String.join(", ", errors));
            return status;
        }
        containerTruckOptional.ifPresent(
                containerTruck -> {
                    if (file != null && !file.isEmpty()) {

                        String path = "container/" + containerTruck.getLicensePlate() + "/" + editContainerRequest.getAttach();
                        blobService.uploadMultipart(path, file);

                    }
                    if (StringUtils.isNotEmpty(containerTruck.getAttach())
                            && StringUtils.isEmpty(editContainerRequest.getAttach())) {
                        String path = "container/" + containerTruck.getLicensePlate() + "/" + containerTruck.getAttach();
                        blobService.deleteContainerFile(path, containerTruck.getTruckId());
                    }
                    containerTruck.setLicensePlate(editContainerRequest.getLicensePlate());
                    containerTruck.setManufacturer(editContainerRequest.getManufacturer());
                    containerTruck.setCapacity(editContainerRequest.getCapacity());
                    containerTruck.setContainerStatus(editContainerRequest.getContainerStatus());
                    containerTruck.setRegistrationDate(editContainerRequest.getRegistrationDate());
                    containerTruck.setAttach(editContainerRequest.getAttach());
                    containerTruckRepository.save(containerTruck);
                    log.info("update containerTruck {} success", containerTruck);
                    status.put(Constants.StatusCode.SUCCESS, new ArrayList<>(List.of("Sửa xe container thành công !")));
                }
        );
        return status;
    }

    @Transactional
    public void changeActiveContainerTruck(String truckId) {
        Optional<ContainerTruck> containerTruckToDelete = containerTruckRepository.findContainerTruckByTruckId(truckId);
        containerTruckToDelete.ifPresent(containerTruck -> {
            if (containerTruck.getIsActive()) {
                containerTruck.setIsActive(false);
            } else {
                containerTruck.setIsActive(true);
            }
            containerTruckRepository.save(containerTruck);
        });
    }

    @Transactional
    public List<ContainerTruck> findAllByInUse() {
        log.info("ContainerTruck Service / findAllByInUse use for User Screen");
        // get all container that not in use
        var listTruckNotInUse = containerTruckRepository.findAllByInUse(false);
        return listTruckNotInUse;
    }
    @Transactional
    public List<ContainerTruck> findAllByInUse(Boolean inUse) {
        log.info("ContainerTruck Service / findAllByInUse use for User Screen");
        // get all container that not in use
        var listTruckUse = containerTruckRepository.findAllByInUse(inUse);
        return listTruckUse;
    }
    @Transactional
    public Optional<ContainerTruck> findTruckByDriver(String driverId){
        var truck = containerTruckRepository.findByDriver_UserId(driverId);
        return truck;
    }

    @Transactional
    public void editUserContainerTruck(String truckId, String userId) {
        log.info("ContainerTruck Service / editUserContainerTruck use for User Screen");
        Optional<ContainerTruck> containerTruckUserToUpdate = containerTruckRepository.findContainerTruckByTruckId(truckId);
        log.info("data : {}", containerTruckUserToUpdate);
        containerTruckUserToUpdate.ifPresent(
                containerTruck -> {
                    containerTruck.setInUse(true);
                    User u = new User();
                    u.setUserId(userId);
                    containerTruck.setDriver(u);
                    containerTruckRepository.save(containerTruck);
                    log.info("update containerTruck {} success", containerTruck);
                }
        );
    }


    @Transactional
    public void editContainerTruckWithDriver(String truckId, String userId) {
        log.info("ContainerTruck Service / editContainerTruckWithDriver use for User Screen");
        Optional<ContainerTruck> containerTruckUserToUpdate = containerTruckRepository.findContainerTruckByTruckId(truckId);
        Optional<ContainerTruck> existDriverInTruck = containerTruckRepository.findByDriver_UserId(userId);
        existDriverInTruck.ifPresent(
                existDriverInTrucks ->
                {
                    existDriverInTrucks.setInUse(false);
                    existDriverInTrucks.setDriver(null);
                    existDriverInTrucks.setContainerStatus(ContainerStatus.READY);
                    containerTruckRepository.save(existDriverInTrucks);
                }
        );
        log.info("data : {}", containerTruckUserToUpdate);
        containerTruckUserToUpdate.ifPresent(
                containerTruck -> {
                    containerTruck.setInUse(true);
                    User u = new User();
                    u.setUserId(userId);
                    containerTruck.setDriver(u);
                    containerTruckRepository.save(containerTruck);
                    log.info("update containerTruck {} success", containerTruck);
                }
        );
    }



    public List<String> validateContainerTruckRequest(ContainerTruck containerRequest) {
        List<String> errors = new ArrayList<>();
        if (checkLicensePlateExist(containerRequest.getLicensePlate())) {
            errors.add("Biển số xe đã tồn tại.");
        }
        return errors;
    }

    public List<String> validateContainerTruckEdit(ContainerTruck containerRequest) {
        List<String> errors = new ArrayList<>();
        var container = containerTruckRepository.findContainerTruckByTruckId(containerRequest.getTruckId());
        if (checkLicensePlateExist(containerRequest.getLicensePlate())) {
            if(!container.get().getLicensePlate().equals(containerRequest.getLicensePlate())){
                errors.add("Biển số xe đã tồn tại.");
            }
        }
        return errors;
    }
    public Boolean checkLicensePlateExist(String licensePlate) {
        Boolean isExist = false;
        if (containerTruckRepository.existsByLicensePlate(licensePlate)) {
            isExist = true;
        }
        return isExist;
    }


    public ContainerTruck findContainerTruckByTruckId(String truckId){
        var truck = containerTruckRepository.findContainerTruckByTruckId(truckId)
                   .orElseThrow(() -> new NotFoundExc("truck not found with ID: " + truckId));
        return truck;
    }




}
