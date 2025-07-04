package com.example.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dto.UserRequestDTO;
import com.example.entity.User;
import com.example.repository.UserRepository;

import lombok.RequiredArgsConstructor;

//사용자가 회원가입할 때 중복된 id있는지 확인, 없으면 암호화된 비밀번호로 db에 저장
@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder pwEncoder;
	
	//사용자가 입력한 userid가 있는지 확인
	public void signup(UserRequestDTO dto) {
		if(userRepository.existsByUserid(dto.getUserid())) {
			throw new RuntimeException("중복되는 아이디입니다.");
		}
		
		//dto에서 받은 정보로 User 엔티티 생성
		User user = User.builder()
				.userid(dto.getUserid())
				.email(dto.getEmail())
				.password(pwEncoder.encode(dto.getPassword()))
				.name(dto.getName())
				.phone(dto.getPhone())
				.birthdate(dto.getBirthdate())
				.create_at(LocalDateTime.now())
				.update_at(LocalDateTime.now())
				.build();
		
		userRepository.save(user);
	}
	
	//사용자가 로그인 시도할 때, 입력한 비밀번호와 db의 암호화된 비밀번호를 비교
	public boolean login(UserRequestDTO dto) {
		return userRepository.findByUserid(dto.getUserid())
				.map(user -> pwEncoder.matches(dto.getPassword(),user.getPassword()))
				.orElse(false);
		//userRepository.findByUserid -> 입력한 userid로 사용자 조회 결과는 Optional<User>형태로 반환됨.
		//.map(user -> pwEncoder.matches(dto.getPassword(),user.getPassword())) -> Optional에 값이 있으면(사용자 존재) matches()로 비밀번호 비교
		//dto는 사용자가 입력한 암호화x비밀번호 user는 db에 저장된 암호화된 비밀번호 둘이 일치하면 true 아니면 false
		//.orElse(false) -> 사용자가 존재하지 않으면 false 반환 -> 로그인 실패
		
	}
}
