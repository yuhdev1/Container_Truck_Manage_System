package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.exception.ValidationExc;
import vn.fpt.edu.ctms.model.TrackingContainer;
import vn.fpt.edu.ctms.repository.TrackingContainerRepository;


@Service
@RequiredArgsConstructor
public class TrackingContainerService {


    private final TrackingContainerRepository trackingContainerRepository;


//    @Transactional
//    public TrackingContainer createTrackingContainer(TrackingContainerDTO trackingContainerDTO) {
//
//        TrackingContainer trackingContainer = TrackingContainer.builder()
//                .order(trackingContainerDTO.getOrder())
//                .containerTruck(trackingContainerDTO.getContainerTruck())
//                .origin(trackingContainerDTO.getOrigin())
//                .destination(trackingContainerDTO.getDestination())
//                .build();
//
//        return trackingContainerRepository.save(trackingContainer);
//
//    }

    public TrackingContainer findTrackingContainerOrderId(String orderId){
        return trackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId)
                .orElseThrow(() -> new NotFoundExc("tracking container  not found with orderID: " + orderId));
    }


    public void checkPoint(String orderId,String location){
        TrackingContainer trackingContainer = trackingContainerRepository.findTrackingContainerByOrder_OrderId(orderId)
                .orElseThrow(() -> new NotFoundExc("tracking container  not found with orderID: " + orderId));

        if(StringUtils.isEmpty(trackingContainer.getFirstLocation())){
            trackingContainer.setFirstLocation(location);
        } else if(StringUtils.isEmpty(trackingContainer.getSecondLocation())){
            trackingContainer.setSecondLocation(location);
        } else if(StringUtils.isEmpty(trackingContainer.getThirdLocation())) {
            trackingContainer.setThirdLocation(location);
        }
        else if(StringUtils.isEmpty(trackingContainer.getDestinationLocation())) {
            trackingContainer.setDestinationLocation(location);
        }
        else {
            throw new ValidationExc("All  location are checked!");
        }
        trackingContainerRepository.save(trackingContainer);
    }




}
