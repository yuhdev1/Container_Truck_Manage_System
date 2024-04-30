package vn.fpt.edu.ctms.consumer;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import vn.fpt.edu.ctms.constant.KafkaConstants;
import vn.fpt.edu.ctms.model.Notification;


@Component
public class MessageListener {
    @Autowired
    SimpMessagingTemplate template;

    @KafkaListener(
            topics = KafkaConstants.KAFKA_TOPIC,
            groupId = KafkaConstants.GROUP_ID
    )
    public void listen(Notification notification) {
        System.out.println("sending via kafka listener.." + notification);
        template.convertAndSend("/user/" + notification.getReceiver() + "/", notification);
    }

}