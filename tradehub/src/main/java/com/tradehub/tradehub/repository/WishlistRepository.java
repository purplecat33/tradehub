package com.tradehub.tradehub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tradehub.tradehub.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    
    List<Wishlist> findByUser_Id(Long userId);

    Optional<Wishlist> findByUser_IdAndProduct_Id(Long userId, Long productId);

    void deleteByUser_IdAndProduct_Id(Long userId, Long productId);

    void deleteByProduct_Id(Long productID);
}
