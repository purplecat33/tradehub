package com.tradehub.tradehub.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tradehub.tradehub.entity.Product;
import com.tradehub.tradehub.entity.ProductStatus;
import com.tradehub.tradehub.entity.Trade;
import com.tradehub.tradehub.entity.TradeStatus;
import com.tradehub.tradehub.entity.User;
import com.tradehub.tradehub.repository.ProductRepository;
import com.tradehub.tradehub.repository.TradeRepository;
import com.tradehub.tradehub.repository.UserRepository;

@Service
public class TradeService {
    
    private final TradeRepository tradeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public TradeService(
        TradeRepository tradeRepository,
        ProductRepository productRepository,
        UserRepository userRepository
    ) {
        this.tradeRepository = tradeRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public Trade requestTrade(Long buyerId, Long productId) {

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("구매자를 찾을 수 없습니다."));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        User seller = product.getUser();

        if (seller.getId().equals(buyer.getId())) {
            throw new IllegalArgumentException("본인 상품에는 거래 요청을 할 수 없습니다.");
        }

        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new IllegalArgumentException("거래 요청이 불가능한 상황입니다.");
        }

        boolean alreadyRequested = tradeRepository.existsByBuyerIdAndProductId(buyerId, productId);

        if (alreadyRequested) {
            throw new IllegalArgumentException("이미 거래 요청한 상품입니다.");
        }

        Trade trade = new Trade();
        trade.setBuyer(buyer);
        trade.setSeller(seller);
        trade.setProduct(product);
        trade.setStatus(TradeStatus.REQUESTED);
        trade.setCreatedAt(LocalDateTime.now());

        return tradeRepository.save(trade);
    }

    public List<Trade> getSentTrades(Long buyerId) {

        return tradeRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId);
    }

    public List<Trade> getReceivedTrades(Long sellerId) {

        return tradeRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);
    }

    public Trade acceptTrade(Long tradeId, Long sellerId) {
        
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new IllegalArgumentException("거래 요청을 찾을 수 없습니다."));

        if (!trade.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("거래 요청을 처리할 권한이 없습니다.");
        }

        if (trade.getStatus() != TradeStatus.REQUESTED) {
            throw new IllegalArgumentException("이미 처리된 거래 요청입니다.");
        }

        Product product = trade.getProduct();

        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new RuntimeException("이미 거래 중이거나 판매 완료된 상품입니다.");
        }

        trade.setStatus(TradeStatus.ACCEPTED);
        product.setStatus(ProductStatus.RESERVED);

        productRepository.save(product);

        return tradeRepository.save(trade);
    }

    public Trade rejectTrade(Long tradeId, Long sellerId) {

        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new IllegalArgumentException("거래 요청을 찾을 수 없습니다."));

        if (!trade.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("거래 요청을 처리할 권한이 없습니다.");
        }

        if (trade.getStatus() != TradeStatus.REQUESTED) {
            throw new IllegalArgumentException("이미 처리된 거래 요청입니다.");
        }

        trade.setStatus(TradeStatus.REJECTED);

        return tradeRepository.save(trade);
    }

    public Trade completeTrade(Long tradeId, Long sellerId) {

        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new IllegalArgumentException("거래 요청을 찾을 수 없습니다."));

        if (!trade.getSeller().getId().equals(sellerId)) {
            throw new IllegalArgumentException("거래 완료 처리 권한이 없습니다.");
        }

        if (trade.getStatus() != TradeStatus.ACCEPTED) {
            throw new IllegalArgumentException("수락된 거래만 완료 처리할 수 있습니다.");
        }

        Product product = trade.getProduct();

        if (product.getStatus() != ProductStatus.RESERVED) {
            throw new IllegalArgumentException("거래중인 상품만 완료 처리할 수 있습니다.");
        }

        trade.setStatus(TradeStatus.COMPLETED);
        product.setStatus(ProductStatus.SOLD);

        productRepository.save(product);

        return tradeRepository.save(trade);
    }
}
