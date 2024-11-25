package co.fishtopia.smc.data.domains;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "aelf_tx", uniqueConstraints = {@UniqueConstraint(name = "tx_id_unique", columnNames = "tx_id")})
public class AeflTx extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "[id]")
    private UUID id;

    @Column(name = "[tx_id]")
    private String txId;

    @Column(name = "[tx_method]")
    private String txMethod;

    @Column(name = "[from]")
    private String from;

    @Column(name = "[to]")
    private String to;

    @Column(name = "[value]")
    private BigDecimal value;

    @Column(name = "[fee]")
    private BigDecimal fee;
}
