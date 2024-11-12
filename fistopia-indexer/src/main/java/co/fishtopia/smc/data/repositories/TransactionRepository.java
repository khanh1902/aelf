package co.fishtopia.smc.data.repositories;

import co.fishtopia.smc.data.domains.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Transaction findByTransactionId(String transactionId);
}
