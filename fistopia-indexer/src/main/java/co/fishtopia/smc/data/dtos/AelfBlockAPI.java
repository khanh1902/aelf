package co.fishtopia.smc.data.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;


public class AelfBlockAPI {
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response<T> {
        private Integer total;
        private ArrayList<T> transactions;
    }
}
