package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.User;

//사용자가 있는지 없는지 확인하는데 사용됨
//우리 아이디 만들 때 중복되는 아이디입니다 나타나게 해주려고 사용하는 거라 생각하면 됨
public interface UserRepository extends JpaRepository<User, Long>{
	//userid가 존재하면 해당 User객체를 반환, 없으면 Optional 반환
	Optional<User> findByUserid(String userid);
	
	//userid가 존재하면 true 없으면 false
	boolean existsByUserid(String userid);
}
