package com.parmugilan.SweetShop.Repository;

import com.parmugilan.SweetShop.Models.Sweet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SweetRepository extends MongoRepository<Sweet, String> {

    List<Sweet> findByNameContainingIgnoreCase(String name);

    List<Sweet> findByCategoryIgnoreCase(String category);

    List<Sweet> findByPriceBetween(double minPrice, double maxPrice);
}
