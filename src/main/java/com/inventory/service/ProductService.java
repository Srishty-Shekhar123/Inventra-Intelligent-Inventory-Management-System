package com.inventory.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.inventory.model.Product;
import com.inventory.model.StockLog;
import com.inventory.model.Transaction;              // ✅ ADD
import com.inventory.repository.ProductRepository;
import com.inventory.repository.StockLogRepository;
import com.inventory.repository.TransactionRepository; // ✅ ADD

@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final StockLogRepository logRepo;
    private final AlertService alertService;
    private final TransactionRepository transactionRepo; // ✅ ADD

    // ✅ UPDATE CONSTRUCTOR (ONLY ADD PARAMETER)
    public ProductService(
            ProductRepository productRepo,
            StockLogRepository logRepo,
            AlertService alertService,
            TransactionRepository transactionRepo   // ✅ ADD
    ) {
        this.productRepo = productRepo;
        this.logRepo = logRepo;
        this.alertService = alertService;
        this.transactionRepo = transactionRepo;      // ✅ ADD
    }

    // ================= ADD PRODUCT =================
    public Product addProduct(Product product) {

        Product saved = productRepo.save(product);

        // ✅ TRANSACTION LOG
        Transaction t = new Transaction();
        t.setSku(saved.getSku());
        t.setProductName(saved.getName());
        t.setAction("ADD_PRODUCT");
        t.setQuantity(saved.getQuantity());
        t.setPerformedBy("admin");
        t.setDateTime(LocalDateTime.now());
        transactionRepo.save(t);

        checkAlert(saved);

        return saved;
    }

    // ================= EDIT PRODUCT =================
    public Product updateProduct(Product product) {

        Product updated = productRepo.save(product);

        checkAlert(updated);

        return updated;
    }

    // ================= DELETE PRODUCT =================
    public void deleteProduct(Long id) {
        productRepo.deleteById(id);
    }

    // ================= STOCK IN =================
    public void stockIn(String sku, int qty, String role) {

        Product p = productRepo.findBySku(sku).orElseThrow();

        p.setQuantity(p.getQuantity() + qty);
        productRepo.save(p);

        log("STOCK_IN", sku, qty, role);

        // ✅ TRANSACTION LOG
        Transaction t = new Transaction();
        t.setSku(p.getSku());
        t.setProductName(p.getName());
        t.setAction("STOCK_IN");
        t.setQuantity(qty);
        t.setPerformedBy(role);
        t.setDateTime(LocalDateTime.now());
        transactionRepo.save(t);

        checkAlert(p);
    }

    // ================= STOCK OUT =================
    public void stockOut(String sku, int qty, String role) {

        Product p = productRepo.findBySku(sku).orElseThrow();

        if (p.getQuantity() < qty) {
            throw new RuntimeException("Insufficient stock");
        }

        p.setQuantity(p.getQuantity() - qty);
        productRepo.save(p);

        log("STOCK_OUT", sku, qty, role);

        // ✅ TRANSACTION LOG
        Transaction t = new Transaction();
        t.setSku(p.getSku());
        t.setProductName(p.getName());
        t.setAction("STOCK_OUT");
        t.setQuantity(qty);
        t.setPerformedBy(role);
        t.setDateTime(LocalDateTime.now());
        transactionRepo.save(t);

        checkAlert(p);
    }

    // ================= GET ALL =================
    public List<Product> allProducts() {
        return productRepo.findAll();
    }

    // ================= STOCK LOG =================
    private void log(String action, String sku, int qty, String role) {

        StockLog log = new StockLog();
        log.setAction(action);
        log.setSku(sku);
        log.setQuantity(qty);
        log.setPerformedBy(role);

        logRepo.save(log);
    }

    // ================= ALERT LOGIC =================
    private void checkAlert(Product p) {

        if (p.getQuantity() == 0) {
            alertService.createAlert(
                "CRITICAL",
                p.getName() + " is out of stock"
            );
        }
        else if (p.getQuantity() <= 5) {
            alertService.createAlert(
                "LOW",
                p.getName() + " stock is low"
            );
        }
    }

    // ================= FIFO STOCK LIST =================
public List<Product> getFifoStock() {
    return productRepo.findByQuantityGreaterThanOrderByExpiryDateAsc(0);
}

}