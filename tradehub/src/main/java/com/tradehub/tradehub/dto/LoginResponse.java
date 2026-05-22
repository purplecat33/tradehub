package com.tradehub.tradehub.dto;

import java.time.LocalDateTime;

public class LoginResponse {
    
    private Long id;
    private String username;
    private String name;
    private String email;

    private String provider;

    private LocalDateTime createdAt;

    public LoginResponse(Long id, String username, String name, String email, String provider, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.createdAt = createdAt;
    }

    public Long getId() {

        return id;
    }

    public String getUsername() {

        return username;
    }

    public String getName() {

        return name;
    }

    public String getEmail() {

        return email;
    }

    public String getProvider() {

        return provider;
    }

    public LocalDateTime getCreatedAt() {

        return createdAt;
    }
}
