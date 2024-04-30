package vn.fpt.edu.ctms.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "notification")
public class Notification {
    @Id
    @Column(name = "id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "customer", referencedColumnName = "user_id")
    private User customer;

    @ManyToOne
    @JoinColumn(name = "orders", referencedColumnName = "order_id")
    private Order order;

    @Column(name="content")
    private String  content;

    @Column(name = "time_stamp")
    private String timestamp;

    @Column(name = "seen")
    private Boolean seen;

    @Column(name = "receiver")
    private String  receiver;

    @PrePersist
    public void generateId() {
        this.id = UUID.randomUUID().toString();
    }

}
