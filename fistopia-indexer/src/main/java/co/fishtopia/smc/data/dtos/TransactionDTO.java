package co.fishtopia.smc.data.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


public class TransactionDTO {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class APIResponse {
        private Integer id;
        private String tx_id;
        private String params_to;
        private String chain_id;
        private String address_from;
        private String address_to;
        private String params;
        private String method;
        private String block_hash;
        private String tx_fee;
        private String resources;
        private Integer quantity;
        private String tx_status;
        private Date time;
//        private Long payable_amount;
//        private String user_id;
//        private String items_id;
//        private String payment_token;
    }
}
