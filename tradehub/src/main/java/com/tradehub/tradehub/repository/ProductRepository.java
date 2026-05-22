package com.tradehub.tradehub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tradehub.tradehub.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByTitleContaining(String keyword);
}
