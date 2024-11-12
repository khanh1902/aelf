package co.fishtopia.smc.data.domains;


import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transactions", uniqueConstraints = {@UniqueConstraint(name = "transaction_id_unique", columnNames = "transaction_id")})
public class Transaction extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "[id]")
    private UUID id;

    @Column(name = "[sender]")
    private String sender;

    @Column(name = "[user_id]")
    private String user_id;

    @Column(name = "[items_id]")
    private String itemsId;

    @Column(name = "[receiver]")
    private String receiver;

    @Column(name = "[amount]")
    private Long amount;

    @Column(name = "[payment_token]")
    private String paymentToken;

    @Column(name = "[transaction_id]")
    private String transactionId;
}
