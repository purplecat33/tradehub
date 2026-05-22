package com.tradehub.tradehub.service;

import java.util.Map;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.tradehub.tradehub.entity.User;
import com.tradehub.tradehub.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService{
    
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest
                .getClientRegistration()
                .getRegistrationId();

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String providerId = String.valueOf(attributes.get("sub"));

        String email = String.valueOf(attributes.get("email"));

        String name = String.valueOf(attributes.get("name"));

        String username = provider + "_" + providerId;

        User user = userRepository
                .findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    User newUser = new User();

                    newUser.setUsername(username);
                    newUser.setPassword(null);
                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setProvider(provider);
                    newUser.setProviderId(providerId);

                    return userRepository.save(newUser);
                });

        return oAuth2User;
    }
}
