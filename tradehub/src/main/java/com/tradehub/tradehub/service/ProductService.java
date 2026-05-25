package com.tradehub.tradehub.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tradehub.tradehub.entity.Product;
import com.tradehub.tradehub.entity.ProductStatus;
import com.tradehub.tradehub.entity.User;
import com.tradehub.tradehub.entity.ProductCondition;
import com.tradehub.tradehub.repository.ProductRepository;
import com.tradehub.tradehub.repository.UserRepository;
import com.tradehub.tradehub.repository.WishlistRepository;


@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistRepository wishlistRepository;

    private final String uploadDir = "C:/upload/";

    public ProductService(ProductRepository productRepository, UserRepository userRepository, WishlistRepository wishlistRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.wishlistRepository = wishlistRepository;
    }

    public Product createProduct(
        String title,
        Integer price,
        String description,
        String productCondition,
        Long userId,
        MultipartFile image
    ) {
        User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자 없음"));

        Product product = new Product();
        product.setTitle(title);
        product.setPrice(price);
        product.setDescription(description);
        product.setStatus(ProductStatus.AVAILABLE);
        product.setUser(user);

        if (productCondition != null && !productCondition.isEmpty()) {
            product.setProductCondition(ProductCondition.valueOf(productCondition));

        } else {
            product.setProductCondition(ProductCondition.GOOD);
        }

        product.setUser(user);

        if (image != null && !image.isEmpty()) {

            String imageUrl = saveImage(image);
            product.setImageUrl(imageUrl);
        }

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    public Product getProductById(Long id) {

        return productRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다." + id));
    }

    public List<Product> searchProducts(String keyword) {

        return productRepository.findByTitleContaining(keyword);
    }

    public Product updateProduct(Long id, String title, Integer price, String description, String status, String productCondition, Long loginUserId, MultipartFile image) {
        Product product = productRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("해당 상품이 존재하지 않습니다." + id));

        if (!product.getUser().getId().equals(loginUserId)) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        product.setTitle(title);
        product.setDescription(description);
        product.setPrice(price);

        if (status != null && !status.isEmpty()) {
            product.setStatus(ProductStatus.valueOf(status));
        }

        if (productCondition != null && !productCondition.isEmpty()) {
            product.setProductCondition(ProductCondition.valueOf(productCondition));
        }

        if (image != null && !image.isEmpty()) {

            if (product.getImageUrl() != null) {
                File oldFile = new File(uploadDir + product.getImageUrl());

                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            String imageUrl = saveImage(image);
            product.setImageUrl(imageUrl);
        }

        return productRepository.save(product);
    }

    private String saveImage(MultipartFile image) {

        try {
            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = image.getOriginalFilename();
            String savedFileName = UUID.randomUUID().toString() + "_" + originalFilename;

            File saveFile = new File(uploadDir + savedFileName);
            image.transferTo(saveFile);

            return savedFileName;

        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패");
        }
    }

    public void deleteProduct(Long id, Long loginUserId) {
        Product product = productRepository.findById(id)
                                .orElseThrow(() -> new IllegalArgumentException("삭제할 상품이 존재하지 않습니다" + id));

        if (!product.getUser().getId().equals(loginUserId)) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        wishlistRepository.deleteByProduct_Id(id);

        if (product.getImageUrl() != null) {
            File imageFile = new File(uploadDir + product.getImageUrl());

            if (imageFile.exists()) {
                imageFile.delete();
            }
        }

        productRepository.delete(product);
    }
}
