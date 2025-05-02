package com.example.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//사용자가 웹 페이지에서 입력한 정보를 서버로 전송하기 위해 만들어진 DTO
// 회원가입 요청 처리가 끝나면 UserRequestDTO의 데이터를 User 엔티티로 변환하여 데이터베이스에 저장
@Data

//이 아래 두개 어노테이션은 롬북에서 제공하는 어노테이션임 자동으로 생성자를 만들어줌
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
	private String userid;
	private String email;
	private String password;
	private String name;
	private String phone;
	private LocalDate birthdate;
}
