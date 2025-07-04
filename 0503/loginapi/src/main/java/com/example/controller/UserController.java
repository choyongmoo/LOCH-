package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.dto.UserRequestDTO;
import com.example.service.UserService;

import lombok.RequiredArgsConstructor;

//테스트할 때 localhost:8081/ 입력
@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/")
    public String loginPage() {
        return "login"; 
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup"; 
    }

    @GetMapping("/success")
    public String successPage() {
        return "loginsuccess"; 
    }
    
    //로그인할때 계정이 있으면 바로 위에 있는 /success로 가고 없으면 그냥 로그인화면으로 다시 새로고침 -> 계정이 없다고 알려줄 수 있게 할 수는 있지만 귀찮,, ㅎㅎ;;
    @PostMapping("/login")
    public String login(@ModelAttribute UserRequestDTO dto) {
        if (userService.login(dto)) {
            return "redirect:/success";
        }
        return "redirect:/";
    }
    
    //회원가입 성공하면 로그인화면으로
    @PostMapping("/signup")
    public String signup(@ModelAttribute UserRequestDTO dto) {
        userService.signup(dto);
        return "redirect:/";
    }
}
