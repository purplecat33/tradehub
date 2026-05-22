package com.tradehub.tradehub.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tradehub.tradehub.entity.Product;
import com.tradehub.tradehub.service.ProductService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
        @RequestParam("title") String title,
        @RequestParam("price") Integer price,
        @RequestParam("description") String description,
        @RequestParam("userId") Long userId,
        @RequestParam(value = "image", required = false) MultipartFile image
    ) {

        try {
            Product product = productService.createProduct(title, price, description, userId, image);

            return ResponseEntity.ok(product);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {

        try {
            Product product = productService.getProductById(id);

            return ResponseEntity.ok(product);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestParam("title") String title, @RequestParam("price") Integer price, @RequestParam("description") String description, @RequestParam(value = "status", required = false) String status, @RequestParam("loginUserId") Long loginUserId, @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            Product product = productService.updateProduct(id, title, price, description, status, loginUserId, image);

            return ResponseEntity.ok(product);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, @RequestParam Long loginUserId) {

        try {
            productService.deleteProduct(id, loginUserId);

            return ResponseEntity.ok("상품이 삭제되었습니다.");

        }catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
