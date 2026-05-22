package com.tradehub.tradehub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tradehub.tradehub.entity.Trade;

public interface TradeRepository extends JpaRepository<Trade, Long> {

    boolean existsByBuyerIdAndProductId(Long buyerId, Long productId);

    List<Trade> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    List<Trade> findBySellerIdOrderByCreatedAtDesc(Long sellerId);
    
}
