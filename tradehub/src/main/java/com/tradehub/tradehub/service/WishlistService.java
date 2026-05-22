package com.tradehub.tradehub.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tradehub.tradehub.entity.Product;
import com.tradehub.tradehub.entity.User;
import com.tradehub.tradehub.entity.Wishlist;
import com.tradehub.tradehub.repository.ProductRepository;
import com.tradehub.tradehub.repository.UserRepository;
import com.tradehub.tradehub.repository.WishlistRepository;

@Service
public class WishlistService {
    
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;                   
    }

    public Wishlist addWishlist(Long userId, Long productId) {

        if (wishlistRepository.findByUser_IdAndProduct_Id(userId, productId).isPresent()) {
            throw new IllegalArgumentException("이미 찜한 상품입니다.");
        }

        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 회원이 존재하지 않습니다." + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다" + productId));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getWishlistByUserId(Long userId) {

        return wishlistRepository.findByUser_Id(userId);
    }

    public void removeWishlist(Long userId, Long productId) {
        Wishlist wishlist = wishlistRepository.findByUser_IdAndProduct_Id(userId, productId)
                            .orElseThrow(() -> new IllegalArgumentException("찜한 내역이 존재하지 않습니다."));

        wishlistRepository.delete(wishlist);
    }
}
