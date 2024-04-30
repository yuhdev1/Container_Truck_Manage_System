package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fpt.edu.ctms.dto.OrderDTO;
import vn.fpt.edu.ctms.dto.OrderDetailDTO;
import vn.fpt.edu.ctms.model.Order;
import vn.fpt.edu.ctms.model.OrderDetail;
import vn.fpt.edu.ctms.model.OrderType;
import vn.fpt.edu.ctms.model.Status;
import vn.fpt.edu.ctms.repository.OrderDetailRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;



    public List<String> validateRequest(OrderDetailDTO request) {
        List<String> errors = new ArrayList<>();



        if (StringUtils.isEmpty(request.getOrderType()) || !isValidOrderType(request.getOrderType())) {
            errors.add("Invalid order type");
        }

        if(request.getQuantity() == null)
        {
            request.setQuantity(0);
        }

        if(request.getCubicMeter() == null)
        {
            request.setCubicMeter(0);
        }



        if(request.getKilogram() == null)
        {
            request.setKilogram(0);
        }


        return errors;

    }


    @Transactional
    public void saveOrderDetails(List<OrderDetailDTO> orderDetailDTOList,Order order) {
        orderDetailDTOList.forEach(orderDetailDTO -> {
            validateRequest(orderDetailDTO);
            OrderDetail orderDetail = OrderDetail.builder()
                                                .order(order)
                                                .orderType(OrderType.valueOf(orderDetailDTO.getOrderType()))
                                                .quantity(orderDetailDTO.getQuantity())
                                                .cubicMeter(orderDetailDTO.getCubicMeter())
                                                .kilogram(orderDetailDTO.getKilogram()).build();

            orderDetailRepository.save(orderDetail);
        });
    }

//    public void updateOrderdetails(String orderId, List<OrderDetailDTO> orderDetailDTOList) {
//        List<OrderDetail> existingOrderDetails = orderDetailRepository.findAllByOrder_OrderId(orderId);
//        existingOrderDetails.forEach(orderDetailRepository::delete);
//
//        orderDetailDTOList.forEach(orderDetailDTO -> {
//            Order order = orderService.findbyOrderId(orderId);
//
//            OrderDetail orderDetail = OrderDetail.builder()
//                    .order(order)
//                    .orderType(OrderType.valueOf(orderDetailDTO.getOrderType()))
//                    .quantity(orderDetailDTO.getQuantity())
//                    .cubicMeter(orderDetailDTO.getCubicMeter())
//                    .kilogram(orderDetailDTO.getKilogram()).build();
//
//            orderDetailRepository.save(orderDetail);
//        });
//    }



    public List<OrderDetail> getOrderDetailsByOrderId(String orderId){
            return orderDetailRepository.findAllByOrder_OrderId(orderId);
    }



    private boolean isValidOrderType(String type) {
        for (OrderType validStatus : OrderType.values()) {
            if (validStatus.name().equalsIgnoreCase(type)) {
                return true;
            }
        }
        return false;
    }


}