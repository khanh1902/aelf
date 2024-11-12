package co.fishtopia.telegram;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.amqp.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, RabbitAutoConfiguration.class, RedisAutoConfiguration.class})
public class PasswordEncoderTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    public void testPasswordEncoderBean() {
        PasswordEncoder passwordEncoder = applicationContext.getBean(PasswordEncoder.class);
        assertThat(passwordEncoder).isNotNull();
        assertThat(passwordEncoder).isInstanceOf(BCryptPasswordEncoder.class);

        // Optional: You can test encoding and matching a password
        String rawPassword = "fishtopia_918Dd1kanqtS";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        System.out.println("rawPassword: " + rawPassword);
        System.out.println("encodedPassword: " + encodedPassword);
        assertThat(passwordEncoder.matches(rawPassword, encodedPassword)).isTrue();
    }

    public static void main(String[] args) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String rawPassword = "fishtopia_918Dd1kanqtS";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        System.out.println("rawPassword: " + rawPassword);
        System.out.println("encodedPassword: " + encodedPassword);
    }
}