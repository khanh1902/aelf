package co.fishtopia.smc.services;

import co.fishtopia.smc.data.dtos.AelfBlockAPI;
import co.fishtopia.smc.data.dtos.TransactionDTO;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@Data
@RequiredArgsConstructor
public class AelfBlockApiService {
    private final RestTemplate restTemplate;

    @Value("${spring.smc.address}")
    private String smcAddress;

    @Value("${spring.smc.export-block-api}")
    private String endPoint;

    public AelfBlockAPI.Response<TransactionDTO.APIResponse> getTransactions(Integer page, Integer limit, String method) {
        AelfBlockAPI.Response<TransactionDTO.APIResponse> response = new AelfBlockAPI.Response<>();
        try {
            String URL = endPoint + "/api/address/transactions";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(URL)
                    .queryParam("contract_address", smcAddress)
                    .queryParam("page", page)
                    .queryParam("limit", limit)
                    .queryParam("address", smcAddress)
                    .queryParam("order", "ASC")
                    .queryParam("method", method);


            ParameterizedTypeReference<AelfBlockAPI.Response<TransactionDTO.APIResponse>> responseType =
                    new ParameterizedTypeReference<AelfBlockAPI.Response<TransactionDTO.APIResponse>>() {
                    };

            response = restTemplate
                    .exchange(uriBuilder.toUriString(), HttpMethod.GET, new HttpEntity<>(headers), responseType)
                    .getBody();


        } catch (Exception ignored) {
        }
        return response;
    }
}
