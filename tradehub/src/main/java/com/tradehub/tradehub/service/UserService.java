package com.tradehub.tradehub.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tradehub.tradehub.entity.User;
import com.tradehub.tradehub.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        
        return userRepository.findAll();
    }

    public User getUserById(Long id) {

        return userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다." + id));
    }
}
