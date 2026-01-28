package com.inventory.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.model.Product;
import com.inventory.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Product add(@RequestBody Product p) {
        return service.addProduct(p);
    }

    @PutMapping("/update")
    public Product update(@RequestBody Product p) {
        return service.updateProduct(p);
    }

    @DeleteMapping("/delete/{id}")
public void deleteProduct(@PathVariable Long id) {
    service.deleteProduct(id);
}



    @PostMapping("/stock-in")
    public void stockIn(@RequestBody Map<String, String> data) {
        service.stockIn(
            data.get("sku"),
            Integer.parseInt(data.get("qty")),
            data.get("role")
        );
    }

    @PostMapping("/stock-out")
    public void stockOut(@RequestBody Map<String, String> data) {
        service.stockOut(
            data.get("sku"),
            Integer.parseInt(data.get("qty")),
            data.get("role")
        );
    }

    @GetMapping("/all")
    public List<Product> all() {
        return service.allProducts();
    }

    @GetMapping("/fifo")
public List<Product> getFifoProducts() {
    return service.getFifoStock();
}

}
