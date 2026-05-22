package com.tradehub.tradehub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tradehub.tradehub.entity.Trade;
import com.tradehub.tradehub.service.TradeService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/trades")
public class TradeController {
    
    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @PostMapping
    public ResponseEntity<?> requestTrade(
        @RequestParam Long buyerId,
        @RequestParam Long productId
    ) {

        try {
            Trade trade = tradeService.requestTrade(buyerId, productId);

            return ResponseEntity.ok(trade);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/sent")
    public ResponseEntity<?> getSentTrades(@RequestParam Long buyerId) {
        
        try {

            return ResponseEntity.ok(tradeService.getSentTrades(buyerId));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/received")
    public ResponseEntity<?> getMyReceivedTrades(@RequestParam Long sellerId) {

        try {

            return ResponseEntity.ok(tradeService.getReceivedTrades(sellerId));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{tradeId}/accept")
    public ResponseEntity<?> acceptTrade (
        @PathVariable Long tradeId,
        @RequestParam Long sellerId
    ) {
        
        try {

            return ResponseEntity.ok(tradeService.acceptTrade(tradeId, sellerId));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{tradeId}/reject")
    public ResponseEntity<?> rejectTrade(
        @PathVariable Long tradeId,
        @RequestParam Long sellerId
    ) {

        try {

            return ResponseEntity.ok(tradeService.rejectTrade(tradeId, sellerId));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{tradeId}/complete")
    public ResponseEntity<?> completeTrade (
        @PathVariable Long tradeId,
        @RequestParam Long sellerId
    ) {

        try {
            
            return ResponseEntity.ok(tradeService.completeTrade(tradeId, sellerId));

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
