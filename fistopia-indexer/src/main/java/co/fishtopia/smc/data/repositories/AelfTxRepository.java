package co.fishtopia.smc.data.repositories;

import co.fishtopia.smc.data.domains.AeflTx;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<AeflTx, UUID> {
    AeflTx findByTransactionId(String transactionId);
}
