package com.parmugilan.SweetShop.Controllers;

import com.parmugilan.SweetShop.Models.Sweet;
import com.parmugilan.SweetShop.Services.SweetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sweets")
@CrossOrigin(origins = "*")
public class SweetController {

    @Autowired
    private SweetService sweetService;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Sweet> addSweet(@RequestBody Sweet sweet) {
        Sweet created = sweetService.addSweet(sweet);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<Sweet>> getAllSweets() {
        return ResponseEntity.ok(sweetService.getAllSweets());
    }


    @GetMapping("/search")
    public ResponseEntity<List<Sweet>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return ResponseEntity.ok(
                sweetService.searchSweets(name, category, minPrice, maxPrice)
        );
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Sweet> updateSweet(
            @PathVariable String id,
            @RequestBody Sweet sweet
    ) {
        Sweet updated = sweetService.updateSweet(id, sweet);
        return ResponseEntity.ok(updated);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSweet(@PathVariable String id) {
        sweetService.deleteSweet(id);
        return ResponseEntity.ok(Map.of("message", "Sweet deleted successfully"));
    }


    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/purchase")
    public ResponseEntity<Sweet> purchaseSweet(
            @PathVariable String id,
            @RequestParam int quantity
    ) {
        Sweet purchased = sweetService.purchaseSweet(id, quantity);
        return ResponseEntity.ok(purchased);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/restock")
    public ResponseEntity<Sweet> restockSweet(
            @PathVariable String id,
            @RequestParam int quantity
    ) {
        Sweet restocked = sweetService.restockSweet(id, quantity);
        return ResponseEntity.ok(restocked);
    }
}
