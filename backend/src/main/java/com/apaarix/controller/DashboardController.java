package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.enums.DuplicateReviewStatus;
import com.apaarix.enums.VerificationStatus;
import com.apaarix.enums.ViolationStatus;
import com.apaarix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private ApaarVerificationRepository verificationRepo;
    @Autowired private DuplicateAlertRepository duplicateRepo;
    @Autowired private ComplianceViolationRepository complianceRepo;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardMetrics() {
        long totalInst = institutionRepo.count();
        long totalEnrolments = enrolmentRepo.count();
        long totalStudents = studentRepo.count();
        long verified = verificationRepo.countByStatus(VerificationStatus.VERIFIED);
        long pending = verificationRepo.countByStatus(VerificationStatus.PENDING);
        long invalid = verificationRepo.countByStatus(VerificationStatus.INVALID);
        long manual = verificationRepo.countByStatus(VerificationStatus.MANUAL_REVIEW);

        long openViolations = complianceRepo.countByStatus(ViolationStatus.OPEN);
        long duplicateAlerts = duplicateRepo.countByReviewStatus(DuplicateReviewStatus.PENDING);

        double verificationRate = totalStudents > 0 ? ((double) verified / totalStudents) * 100.0 : 0.0;

        Map<String, Object> data = new HashMap<>();
        data.put("totalInstitutions", totalInst);
        data.put("totalEnrolments", totalEnrolments);
        data.put("totalStudents", totalStudents);
        data.put("verifiedCount", verified);
        data.put("pendingCount", pending);
        data.put("invalidCount", invalid);
        data.put("manualReviewCount", manual);
        data.put("verificationRate", Math.round(verificationRate * 10.0) / 10.0);
        data.put("openViolations", openViolations);
        data.put("duplicateAlerts", duplicateAlerts);

        // Verification breakdown for donut chart
        List<Map<String, Object>> statusBreakdown = List.of(
                Map.of("name", "Verified", "value", verified, "color", "#52c41a"),
                Map.of("name", "Pending", "value", pending, "color", "#faad14"),
                Map.of("name", "Invalid", "value", invalid, "color", "#ff4d4f"),
                Map.of("name", "Manual Review", "value", manual, "color", "#13a8a8")
        );
        data.put("statusBreakdown", statusBreakdown);

        // Top institutions by enrolment
        List<Map<String, Object>> topInstitutions = new ArrayList<>();
        institutionRepo.findAllByOrderByApprovedIntakeDesc().stream().limit(6).forEach(inst -> {
            long count = enrolmentRepo.countByInstitutionId(inst.getId());
            double utilization = inst.getApprovedIntake() > 0 ? ((double) count / inst.getApprovedIntake()) * 100.0 : 0;
            topInstitutions.add(Map.of(
                    "id", inst.getId(),
                    "code", inst.getCode(),
                    "name", inst.getName(),
                    "city", inst.getCity(),
                    "state", inst.getState(),
                    "enrolmentCount", count,
                    "approvedIntake", inst.getApprovedIntake(),
                    "utilization", Math.round(utilization * 10.0) / 10.0,
                    "complianceScore", inst.getComplianceScore()
            ));
        });
        data.put("topInstitutions", topInstitutions);

        // Academic Year Trends
        List<Map<String, Object>> trends = List.of(
                Map.of("year", "2021-22", "enrolments", 7420, "verified", 5800),
                Map.of("year", "2022-23", "enrolments", 8650, "verified", 7100),
                Map.of("year", "2023-24", "enrolments", 9840, "verified", 8900),
                Map.of("year", "2024-25", "enrolments", 10890, "verified", 10120)
        );
        data.put("enrolmentTrends", trends);

        return ResponseEntity.ok(ApiResponse.ok("Dashboard metrics retrieved", data));
    }
}

