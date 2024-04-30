package vn.fpt.edu.ctms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.fpt.edu.ctms.constant.KafkaConstants;
import vn.fpt.edu.ctms.dto.NotificationDTO;
import vn.fpt.edu.ctms.exception.NotFoundExc;
import vn.fpt.edu.ctms.model.Notification;
import vn.fpt.edu.ctms.repository.NotificationRepository;
import vn.fpt.edu.ctms.specification.NotificationSpecification;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    private KafkaTemplate<String, Notification> kafkaTemplate;

    public Notification save(Notification notification){
        return notificationRepository.save(notification);
    }



    @Transactional(readOnly = true)
    public Page<Notification> getNotificationByCriteria(NotificationDTO criteria, Pageable pageable) {
        Specification<Notification> spec = NotificationSpecification.filterNotificationByCriteria(criteria);
        return notificationRepository.findAll(spec, pageable);
    }


    public List<Notification> findByOrderId(String id){
        return notificationRepository.findByOrder_OrderId(id)
                .orElseThrow(() -> new NotFoundExc("Notification not found with order ID: " + id));

    }


//    @Transactional(readOnly = true)
//    public List<Notification> getLatestNotifications(int limit) {
//        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "timestamp"));
//
//        Page<Notification> notificationPage = notificationRepository.findAll(pageable);
//
//        return notificationPage.getContent();
//    }
//

    @Transactional
    public Notification updateNotification(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundExc("Notification not found with ID: " + id));

        if (!notification.getSeen()) {
            notification.setSeen(true);
            notification = notificationRepository.save(notification);
        }

        return notification;
    }


    public void  sendNotification(Notification notification){

        try {
            kafkaTemplate.send(KafkaConstants.KAFKA_TOPIC, notification).get();
        } catch (InterruptedException | ExecutionException e) {
            System.err.println("Error occurred while sending message to Kafka:");
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }

}


