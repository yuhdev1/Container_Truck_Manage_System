package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fpt.edu.ctms.dto.ContainerTruckDTO;
import vn.fpt.edu.ctms.dto.DriverScheduleDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.*;
import vn.fpt.edu.ctms.repository.*;
import vn.fpt.edu.ctms.specification.ContainerTruckSpecification;
import vn.fpt.edu.ctms.specification.DriverScheduleSpecification;

import java.sql.Driver;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DriverScheduleService {

    private final DriverScheduleRepository driverScheduleRepository;

    private final OrderService orderService;

    private final ContainerTruckService containerTruckService;

    private final ContainerTruckRepository containerTruckRepository;
    private final TrackingContainerRepository trackingContainerRepository;


    @Transactional(readOnly = true)
    public Page<DriverSchedule> getDriverScheduleByCriteria(DriverScheduleDTO driverSchedule, Pageable pageable) {
        Specification<DriverSchedule> spec = DriverScheduleSpecification.filterByAllFields(driverSchedule);
        return driverScheduleRepository.findAll(spec, pageable);
    }

    public Optional<DriverSchedule> findByOrderId(String orderId) {
        Optional<DriverSchedule> driverSchedule = driverScheduleRepository.findByOrderOrderId(orderId);


        return driverSchedule;
    }

    public boolean checkOverlap(Date from, Date to, String truckId) {
        Specification<DriverSchedule> overlapSpec = DriverScheduleSpecification.overlapWith(from, to, truckId);
        return driverScheduleRepository.count(overlapSpec) > 0;
    }


    public DriverSchedule transportCoordination(String orderId, String truckId) {
        Order order = orderService.findByOrderId(orderId);

        Optional<DriverSchedule> ds = driverScheduleRepository.findByOrderOrderId(order.getOrderId());

        if (ds.isPresent()) {
            throw new ValidationExc("This order had already coordination, please select another one");
        }


        ContainerTruck truck = containerTruckService.findContainerTruckByTruckId(truckId);

        if (!checkOverlap(order.getEtd(), order.getEta(), truck.getDriver().getUserId())) {
            DriverSchedule driverSchedule = DriverSchedule.builder()
                    .order(order)
                    .containerTruck(truck)
                    .driver(truck.getDriver())
                    .transportationCode(generateTransportationCode())
                    .from(order.getEtd())
                    .to(order.getEta())
                    .time_stamp(LocalDateTime.now().toString())
                    .build();

            order.setContainerTruck(truck);

            driverScheduleRepository.save(driverSchedule);

            TrackingContainer trackingContainer = TrackingContainer.builder()
                    .order(order)
                    .containerTruck(truck)
                    .origin(order.getShippingAddress())
                    .destination(order.getDeliveryAddress())
                    .build();

            trackingContainerRepository.save(trackingContainer);

            return driverSchedule;
        } else {
            throw new ValidationExc("overlap with another driver schedule with id:" + truck.getDriver().getUserId());
        }

    }


    public DriverSchedule updateDriverSchedule(String id, DriverScheduleDTO driverScheduleDTO) {
        DriverSchedule driverSchedule = driverScheduleRepository.findById(id)
                .orElseThrow(() -> new NotFoundExc("driver schedule not found with ID: " + id));


        if (StringUtils.isNotEmpty(driverScheduleDTO.getOrderId())) {
            Order order = orderService.findByOrderId(driverScheduleDTO.getOrderId());
            driverSchedule.setOrder(order);
            driverSchedule.setFrom(null);
            driverSchedule.setTo(null);
            if (checkOverlap(order.getEtd(), order.getEta(), driverSchedule.getContainerTruck().getTruckId())) {
                throw new ValidationExc("overlap with another truck with id:" + driverSchedule.getContainerTruck().getDriver().getUserId());

            } else {
                driverSchedule.setFrom(order.getEtd());
                driverSchedule.setTo(order.getEta());
            }

        }

        if (StringUtils.isNotEmpty(driverScheduleDTO.getTruckId())) {
            ContainerTruck truck = containerTruckService.findContainerTruckByTruckId(driverScheduleDTO.getTruckId());

            driverSchedule.setFrom(null);
            driverSchedule.setTo(null);
            if (checkOverlap(driverSchedule.getFrom(), driverSchedule.getTo(), truck.getDriver().getUserId())) {
                throw new ValidationExc("overlap with another driver schedule with id:" + truck.getDriver().getUserId());
            } else {
                driverSchedule.setContainerTruck(truck);
            }
        }


        return driverSchedule;
    }

    public String generateTransportationCode() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMdd");
        String datePart = dateFormat.format(new Date());
        String randomPart = UUID.randomUUID().toString().toUpperCase().replace("-", "").substring(0, 5);
        return datePart + randomPart;
    }



    public Page<ContainerTruck> findTruckNotWorkingByOrderId(String orderId,String licensePlate,String userNumber,String fullName, Pageable pageable) {
        Order order = orderService.findByOrderId(orderId);
        Specification<ContainerTruck> spec = ContainerTruckSpecification.filterWithOrder(licensePlate,userNumber,fullName,true);
        var trucks = containerTruckRepository.findAll(spec);
        List<ContainerTruck> result = new ArrayList<>();

        for (ContainerTruck truck : trucks) {
            if (!checkOverlap(order.getEtd(), order.getEta(), truck.getTruckId())) {
                result.add(truck);
            }
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), result.size());

        return new PageImpl<>(result.subList(start, end), pageable, result.size());
    }
}
