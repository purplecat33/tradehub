package com.tradehub.tradehub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tradehub.tradehub.entity.Wishlist;
import com.tradehub.tradehub.service.WishlistService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping
    public ResponseEntity<?> addWishlist(@RequestParam Long userId, @RequestParam Long productId) {

        try {
            Wishlist wishlist = wishlistService.addWishlist(userId, productId);

            return ResponseEntity.ok(wishlist);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getWishlistByUserId(@PathVariable Long userId) {
        List<Wishlist> wishlistList = wishlistService.getWishlistByUserId(userId);

        return ResponseEntity.ok(wishlistList);
    }

    @DeleteMapping
    public ResponseEntity<?> removeWishlist(@RequestParam Long userId, @RequestParam Long productId) {

        try {
            wishlistService.removeWishlist(userId, productId);

            return ResponseEntity.ok("찜 삭제 완료");

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
