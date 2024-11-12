package co.fishtopia.telegram;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ApplicationTests {

	@Test
	void contextLoads() {
	}


	public static void main(String[] args) {
		String a = "SELECT \"playfab_id\", COUNT(\"playfab_id\") AS \"count\", (SUM(CASE WHEN \"type\" IN ('DEPOSIT', 'REWARD') THEN \"amount\" ELSE 0 END) - SUM(CASE WHEN \"type\" IN ('SPEND', 'WITHDRAW') THEN \"amount\" ELSE 0 END)) AS balance FROM \"cashier_history\" WHERE \"playfab_id\" = :playfabId GROUP BY \"playfab_id\"";
		System.out.println(a);
	}
}
