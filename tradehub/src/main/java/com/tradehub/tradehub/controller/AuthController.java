package com.tradehub.tradehub.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tradehub.tradehub.dto.LoginResponse;
import com.tradehub.tradehub.entity.User;
import com.tradehub.tradehub.service.AuthService;
import com.tradehub.tradehub.dto.UserUpdateRequest;

import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User request) {

        try {
            User savedUser = authService.signup(request);

            LoginResponse response = new LoginResponse(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getProvider(),
                savedUser.getCreatedAt()
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request, HttpSession session) {

        try {
            LoginResponse response = authService.login(
                request.getUsername(),
                request.getPassword()
            );

            session.setAttribute("loginUserId", response.getId());
            session.setAttribute("loginUsername", response.getUsername());
            session.setAttribute("loginName", response.getName());
            session.setAttribute("loginEmail", response.getEmail());
            session.setAttribute("loginProvider", response.getProvider());
            session.setAttribute("loginCreatedAt", response.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Long loginUserId = (Long) session.getAttribute("loginUserId");
        String loginUsername = (String) session.getAttribute("loginUsername");
        String loginName = (String) session.getAttribute("loginName");
        String loginEmail = (String) session.getAttribute("loginEmail");
        String loginProvider = (String) session.getAttribute("loginProvider");
        LocalDateTime loginCreatedAt = (LocalDateTime) session.getAttribute("loginCreatedAt");

        if (loginUserId == null) {

            return ResponseEntity.badRequest().body("로그인된 사용자가 없습니다.");
        }

        LoginResponse response = new LoginResponse(
            loginUserId,
            loginUsername,
            loginName,
            loginEmail,
            loginProvider,
            loginCreatedAt
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(
        @RequestBody UserUpdateRequest request,
        HttpSession session
    ) {
        Long loginUserId = (Long) session.getAttribute("loginUserId");

        if (loginUserId == null) {

            return ResponseEntity.badRequest().body("로그인된 사용자가 없습니다.");
        }

        try {
            LoginResponse response = authService.updateMyInfo(
                loginUserId,
                request.getName(),
                request.getEmail()
            );

            session.setAttribute("loginUsername", response.getUsername());
            session.setAttribute("loginName", response.getName());
            session.setAttribute("loginEmail", response.getEmail());
            session.setAttribute("loginProvider", response.getProvider());
            session.setAttribute("loginCreatedAt", response.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        
        return ResponseEntity.ok("로그아웃 완료");
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMyAccount(HttpSession session) {
        
        Long loginUserId = (Long) session.getAttribute("loginUserId");

        if (loginUserId == null) {

            return ResponseEntity.badRequest().body("로그인된 사용자가 없습니다.");
        }

        try {
            authService.deleteMyAccount(loginUserId);

            session.invalidate();

            return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");

        } catch (IllegalArgumentException e){

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
