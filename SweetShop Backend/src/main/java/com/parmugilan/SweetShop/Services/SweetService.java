package com.parmugilan.SweetShop.Services;

import com.parmugilan.SweetShop.Models.Sweet;
import com.parmugilan.SweetShop.Repository.SweetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service

public class SweetService {

    @Autowired
    private SweetRepository sweetRepository;


    public Sweet addSweet(Sweet sweet) {
        sweet.setActive(true);
        sweet.setCreatedAt(LocalDateTime.now());
        sweet.setUpdatedAt(LocalDateTime.now());
        return sweetRepository.save(sweet);
    }


    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll()
                .stream()
                .filter(Sweet::isActive)
                .toList();
    }

    public List<Sweet> searchSweets(
            String name,
            String category,
            Double minPrice,
            Double maxPrice
    ) {

        if (name != null && !name.isEmpty()) {
            return sweetRepository.findByNameContainingIgnoreCase(name);
        }

        if (category != null && !category.isEmpty()) {
            return sweetRepository.findByCategoryIgnoreCase(category);
        }

        if (minPrice != null && maxPrice != null) {
            return sweetRepository.findByPriceBetween(minPrice, maxPrice);
        }

        return getAllSweets();
    }


    public Sweet updateSweet(String id, Sweet sweet) {
        Sweet existing = sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));

        existing.setName(sweet.getName());
        existing.setCategory(sweet.getCategory());
        existing.setPrice(sweet.getPrice());
        existing.setQuantity(sweet.getQuantity());
        existing.setDescription(sweet.getDescription());
        existing.setUpdatedAt(LocalDateTime.now());

        return sweetRepository.save(existing);
    }


    public void deleteSweet(String id) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));


        sweet.setActive(false);
        sweet.setUpdatedAt(LocalDateTime.now());
        sweetRepository.save(sweet);
    }


    public Sweet purchaseSweet(String id, int quantity) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));

        if (!sweet.isActive()) {
            throw new RuntimeException("Sweet is not available");
        }

        if (sweet.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        sweet.setQuantity(sweet.getQuantity() - quantity);
        sweet.setUpdatedAt(LocalDateTime.now());

        return sweetRepository.save(sweet);
    }


    public Sweet restockSweet(String id, int quantity) {
        Sweet sweet = sweetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sweet not found"));

        sweet.setQuantity(sweet.getQuantity() + quantity);
        sweet.setUpdatedAt(LocalDateTime.now());

        return sweetRepository.save(sweet);
    }
}
