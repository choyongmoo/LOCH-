package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class}) //이거 스프링에서 제공해주는 로그인 페이지 안나오게 하는거
public class LoginapiApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(LoginapiApplication.class, args);
	}
	
	//패스워드 암호화
	@Bean
	public PasswordEncoder pwEncoder() {
		return new BCryptPasswordEncoder();
	}
}
