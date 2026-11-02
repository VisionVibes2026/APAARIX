package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.ApaarVerification;
import com.apaarix.entity.Student;
import com.apaarix.enums.VerificationStatus;
import com.apaarix.integration.MockApaarAdapter;
import com.apaarix.repository.ApaarVerificationRepository;
import com.apaarix.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1/verification")
public class VerificationController {

    @Autowired private ApaarVerificationRepository verificationRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private MockApaarAdapter apaarAdapter;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getVerificationSummary() {
        long verified = verificationRepo.countByStatus(VerificationStatus.VERIFIED);
        long pending = verificationRepo.countByStatus(VerificationStatus.PENDING);
        long invalid = verificationRepo.countByStatus(VerificationStatus.INVALID);
        long manual = verificationRepo.countByStatus(VerificationStatus.MANUAL_REVIEW);
        long total = verificationRepo.count();

        Map<String, Object> data = new HashMap<>();
        data.put("total", total);
        data.put("verified", verified);
        data.put("pending", pending);
        data.put("invalid", invalid);
        data.put("manualReview", manual);
        data.put("verifiedPercentage", total > 0 ? Math.round(((double) verified / total) * 1000.0) / 10.0 : 0);

        return ResponseEntity.ok(ApiResponse.ok("Verification summary retrieved", data));
    }

    @PostMapping("/verify-student/{studentId}")
    public ResponseEntity<ApiResponse<ApaarVerification>> verifyStudent(@PathVariable Long studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        MockApaarAdapter.VerificationResult vRes = apaarAdapter.verifyWithGateway(student.getApaarId(), student.getFullName());

        ApaarVerification ver = verificationRepo.findByStudentId(studentId)
                .orElse(new ApaarVerification(student.getApaarId(), student, vRes.getStatus(), vRes.getConfidence(), vRes.getMessage()));

        ver.setStatus(vRes.getStatus());
        ver.setConfidenceScore(vRes.getConfidence());
        ver.setRemarks(vRes.getMessage());
        ver.setVerifiedAt(Instant.now());

        ApaarVerification saved = verificationRepo.save(ver);
        return ResponseEntity.ok(ApiResponse.ok("Verification updated from gateway", saved));
    }

    @PostMapping("/batch-verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> batchVerifyPending() {
        List<ApaarVerification> pendingList = verificationRepo.findByStatus(VerificationStatus.PENDING);
        int processed = 0;
        int verifiedCount = 0;

        for (ApaarVerification v : pendingList) {
            MockApaarAdapter.VerificationResult vRes = apaarAdapter.verifyWithGateway(v.getApaarId(), v.getStudent().getFullName());
            v.setStatus(vRes.getStatus());
            v.setConfidenceScore(vRes.getConfidence());
            v.setRemarks(vRes.getMessage());
            v.setVerifiedAt(Instant.now());
            verificationRepo.save(v);

            processed++;
            if (vRes.getStatus() == VerificationStatus.VERIFIED) {
                verifiedCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("processedCount", processed);
        result.put("newlyVerifiedCount", verifiedCount);

        return ResponseEntity.ok(ApiResponse.ok("Batch verification completed", result));
    }

    @PostMapping("/override/{verificationId}")
    public ResponseEntity<ApiResponse<ApaarVerification>> overrideStatus(
            @PathVariable Long verificationId,
            @RequestBody Map<String, String> payload) {

        ApaarVerification ver = verificationRepo.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification record not found"));

        String statusStr = payload.get("status");
        String remarks = payload.getOrDefault("remarks", "Manual override by AICTE Administrator");

        ver.setStatus(VerificationStatus.valueOf(statusStr.toUpperCase()));
        ver.setRemarks(remarks);
        ver.setVerifiedAt(Instant.now());
        ver.setConfidenceScore(1.0);

        ApaarVerification saved = verificationRepo.save(ver);
        return ResponseEntity.ok(ApiResponse.ok("Verification status updated manually", saved));
    }
}

