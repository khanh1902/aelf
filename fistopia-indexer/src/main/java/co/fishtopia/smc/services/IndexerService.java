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

import java.util.ArrayList;

@Data
@Service
@RequiredArgsConstructor
public class IndexerService {
    private final TransactionRepository transactionRepository;
    private final AelfBlockApiService aelfBlockApiService;
    private Integer PAGE = 0;
    private Integer TEMP_PAGE = 0;
    private final Integer LIMIT = 500;
    private Integer CHECK_POINT_LIMIT = 500;

    @Scheduled(fixedRate = 1000)
    @Transactional(rollbackFor = Exception.class)
    public void crawlPurchaseItemsEvents() {
        try {
            // transaction will be processed in each crawl
            int maxTransactionProcess = LIMIT;
            ArrayList<TransactionDTO.APIResponse> transactions;
            if (PAGE == 0) {
                int limit = CHECK_POINT_LIMIT < LIMIT ? CHECK_POINT_LIMIT : LIMIT;
                int page = TEMP_PAGE > PAGE ? TEMP_PAGE : LIMIT;
                AelfBlockAPI.Response<TransactionDTO.APIResponse> request = aelfBlockApiService.getTransactions(page, limit, "");

                transactions = request.getTransactions();
                if (transactions.isEmpty()) return;

                int transactionsLength = transactions.size();

                if (transactionsLength < LIMIT) {
                    if (TEMP_PAGE == 0) {
                        CHECK_POINT_LIMIT = (transactionsLength) / TEMP_PAGE + 1;
                    } else {
                        CHECK_POINT_LIMIT = (transactionsLength + CHECK_POINT_LIMIT) / (TEMP_PAGE + 1);
                    }
                    TEMP_PAGE++;
                    maxTransactionProcess = transactionsLength;
                } else {
                    PAGE++;
                    CHECK_POINT_LIMIT = LIMIT;
                }
            } else {
                // change limit if transactions in previous crawl < 500
                int limit = CHECK_POINT_LIMIT > LIMIT ? CHECK_POINT_LIMIT : LIMIT;
                AelfBlockAPI.Response<TransactionDTO.APIResponse> request = aelfBlockApiService.getTransactions(PAGE, limit, "");

                transactions = request.getTransactions();
                if (transactions.isEmpty()) return;

                int transactionsLength = transactions.size();

                // re-calculator if transaction < 500
                if (transactionsLength < LIMIT) {
                    // re-calculator limit check point for next crawl
                    // example: totals from page 0->2 is 1222 -> limit = 1500 - 1222 + 1
                    CHECK_POINT_LIMIT = (transactionsLength + LIMIT * PAGE) / PAGE + 1;
                    maxTransactionProcess = LIMIT * (PAGE + 1) - CHECK_POINT_LIMIT;
                } else {
                    // increase page and reset check point limit
                    PAGE++;
                    CHECK_POINT_LIMIT = LIMIT;
                }
            }

            for (int i = 0; i < maxTransactionProcess; i++) {
                TransactionDTO.APIResponse transaction = transactions.get(i);
                if (transactionRepository.findByTransactionId(transaction.getTx_id()) != null) continue;
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
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
        }
    }

}
