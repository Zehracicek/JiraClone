package com.projecttracker.controller;

import com.projecttracker.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * Tüm kullanıcılar için iş yükü karşılaştırması
     * GET /api/reports/users/workload-comparison
     */
    @GetMapping("/users/workload-comparison")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersWorkloadComparison() {
        List<Map<String, Object>> comparison = reportService.getAllUsersWorkloadComparison();
        return ResponseEntity.ok(comparison);
    }

}