package com.example.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//회원가입 테이블 여기를 마지막으로 거치고 db에 저장된다고 생각하면 됨
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY) //sql의 serial임 -> 자동으로 1씩증가
	private Long id;
	
	private String userid;
	private String email;
	private String password;
	private String name;
	private String phone;
	private LocalDate birthdate;
	private LocalDateTime create_at;
	private LocalDateTime update_at;
}
