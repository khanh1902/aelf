package co.fishtopia.smc.services;

import co.fishtopia.smc.data.domains.Transaction;
import co.fishtopia.smc.data.dtos.AelfBlockAPI;
import co.fishtopia.smc.data.dtos.TransactionDTO;
import co.fishtopia.smc.data.repositories.TransactionRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Data
@Service
@RequiredArgsConstructor
public class IndexerService {
    private final TransactionRepository transactionRepository;
    private final AelfBlockApiService aelfBlockApiService;

    @Scheduled(fixedRate = 1000)
    @Transactional(rollbackFor = Exception.class)
    public void crawlPurchaseItemsEvents() {
        try {
            AelfBlockAPI.Response<TransactionDTO.APIResponse> result = aelfBlockApiService.getTransactions("");
            if (result.getTransactions().size() <= 0) return;
            result.getTransactions().forEach(transaction -> {
                if (transaction == null) return;
                if (transactionRepository.findByTransactionId(transaction.getTx_id()) != null) return;

                Transaction transactionInfo = Transaction.builder()
                        .transactionId(transaction.getTx_id())
                        .amount(transaction.getPayable_amount())
                        .sender(transaction.getAddress_from())
                        .receiver(transaction.getAddress_from())
                        .paymentToken(transaction.getPayment_token())
                        .user_id(transaction.getUser_id())
                        .itemsId(transaction.getItems_id())
                        .build();

                if (transactionInfo == null) return;

                transactionRepository.save(transactionInfo);
            });


        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

}
