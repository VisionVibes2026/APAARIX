package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.dto.SystemInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @Value("${spring.application.name:apaarix-backend}")
    private String applicationName;

    @Value("${apaarix.api.version:v1}")
    private String apiVersion;

    @Autowired(required = false)
    private DataSource dataSource;

    @Autowired
    private Environment environment;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now().toString());
        health.put("service", applicationName);
        health.put("version", "1.0.0");

        boolean dbOk = false;
        String dbProduct = "Unknown";
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                dbOk = !conn.isClosed();
                DatabaseMetaData meta = conn.getMetaData();
                dbProduct = meta.getDatabaseProductName() + " " + meta.getDatabaseProductVersion();
            } catch (Exception e) {
                dbProduct = "Connection error: " + e.getMessage();
            }
        }
        health.put("databaseConnected", dbOk);
        health.put("databaseEngine", dbProduct);

        return ResponseEntity.ok(ApiResponse.ok("Service is healthy and operational", health));
    }

    @GetMapping("/system/info")
    public ResponseEntity<ApiResponse<SystemInfoResponse>> systemInfo() {
        SystemInfoResponse info = new SystemInfoResponse();
        info.setName("APAARIX - Student Verification & Enrolment Intelligence for AICTE");
        info.setVersion("1.0.0-PROTOTYPE");
        info.setStatus("ONLINE");
        info.setEnvironment(Arrays.toString(environment.getActiveProfiles()));
        info.setActiveProfile(environment.getActiveProfiles().length > 0 ? environment.getActiveProfiles()[0] : "default");

        // Database metrics
        Map<String, Object> dbMap = new HashMap<>();
        if (dataSource != null) {
            try (Connection conn = dataSource.getConnection()) {
                DatabaseMetaData meta = conn.getMetaData();
                dbMap.put("connected", true);
                dbMap.put("productName", meta.getDatabaseProductName());
                dbMap.put("productVersion", meta.getDatabaseProductVersion());
                dbMap.put("url", meta.getURL());
                dbMap.put("user", meta.getUserName());
            } catch (Exception e) {
                dbMap.put("connected", false);
                dbMap.put("error", e.getMessage());
            }
        } else {
            dbMap.put("connected", false);
            dbMap.put("error", "No DataSource configured");
        }
        info.setDatabase(dbMap);

        // Memory usage
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> memMap = new HashMap<>();
        memMap.put("totalMemoryMb", runtime.totalMemory() / (1024 * 1024));
        memMap.put("freeMemoryMb", runtime.freeMemory() / (1024 * 1024));
        memMap.put("maxMemoryMb", runtime.maxMemory() / (1024 * 1024));
        memMap.put("availableProcessors", runtime.availableProcessors());
        info.setMemory(memMap);

        return ResponseEntity.ok(ApiResponse.ok("System status retrieved successfully", info));
    }
}
