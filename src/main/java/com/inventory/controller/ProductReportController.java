package com.inventory.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ProductReportController {

    private final ProductRepository repo;

    public ProductReportController(ProductRepository repo) {
        this.repo = repo;
    }

    // ================= JSON REPORT =================
    @GetMapping
    public List<Map<String, Object>> generateReport() {

        List<Map<String, Object>> report = new ArrayList<>();
        List<Product> products = repo.findAll();

        for (Product p : products) {

            Map<String, Object> row = new HashMap<>();

            String status = "OK";
            if (p.getQuantity() == 0) {
                status = "CRITICAL";
            } else if (p.getQuantity() <= 5) {
                status = "LOW";
            }

            row.put("name", p.getName());
            row.put("qty", p.getQuantity());
            row.put("status", status);

            report.add(row);
        }

        return report;
    }

    // ================= PDF REPORT =================
    @GetMapping("/pdf")
    public void downloadReportPdf(HttpServletResponse response) throws Exception {

        response.setContentType("application/pdf");
        response.setHeader(
            "Content-Disposition",
            "attachment; filename=inventory-report.pdf"
        );

        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        document.add(new Paragraph("Inventory Report"));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(3);
        table.addCell("Product");
        table.addCell("Available Stock");
        table.addCell("Status");

        List<Product> products = repo.findAll();

        for (Product p : products) {

            String status = "OK";
            if (p.getQuantity() == 0) status = "CRITICAL";
            else if (p.getQuantity() <= 5) status = "LOW";

            table.addCell(p.getName());
            table.addCell(String.valueOf(p.getQuantity()));
            table.addCell(status);
        }

        document.add(table);
        document.close();
    }
}
