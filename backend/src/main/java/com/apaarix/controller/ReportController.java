package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.ComplianceViolation;
import com.apaarix.entity.Enrolment;
import com.apaarix.entity.Institution;
import com.apaarix.repository.*;
import com.apaarix.service.DataSeederService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private ApaarVerificationRepository verificationRepo;
    @Autowired private DuplicateAlertRepository duplicateRepo;
    @Autowired private ComplianceViolationRepository complianceRepo;
    @Autowired private DataSeederService seederService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReportsSummary() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalInstitutions", institutionRepo.count());
        data.put("totalStudents", studentRepo.count());
        data.put("totalEnrolments", enrolmentRepo.count());
        data.put("duplicateAlerts", duplicateRepo.count());
        data.put("complianceViolations", complianceRepo.count());

        List<Map<String, Object>> instSummary = new ArrayList<>();
        for (Institution inst : institutionRepo.findAll()) {
            long count = enrolmentRepo.countByInstitutionId(inst.getId());
            instSummary.add(Map.of(
                    "institution", inst.getName(),
                    "code", inst.getCode(),
                    "state", inst.getState(),
                    "approvedIntake", inst.getApprovedIntake(),
                    "actualEnrolment", count,
                    "complianceScore", inst.getComplianceScore()
            ));
        }
        data.put("institutionSummary", instSummary);

        return ResponseEntity.ok(ApiResponse.ok("Reports summary generated", data));
    }

    @GetMapping("/export/students")
    public ResponseEntity<String> exportStudentsCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("StudentID,FullName,APAAR_ID,Institution,Programme,AcademicYear,Category,EnrolmentStatus\n");

        for (Enrolment e : enrolmentRepo.findAll()) {
            sb.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    e.getStudent().getStudentId(),
                    e.getStudent().getFullName().replace("\"", "\"\""),
                    e.getStudent().getApaarId(),
                    e.getInstitution().getName().replace("\"", "\"\""),
                    e.getProgramme().getName().replace("\"", "\"\""),
                    e.getAcademicYear(),
                    e.getAdmissionCategory().name(),
                    e.getStatus().name()));
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"apaarix_students_registry.csv\"")
                .header("Content-Type", "text/csv")
                .body(sb.toString());
    }

    @GetMapping("/export/compliance")
    public ResponseEntity<String> exportComplianceCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ViolationID,Institution,Programme,AcademicYear,ApprovedIntake,ActualEnrolment,ExcessCount,Severity,Status,Notes\n");

        for (ComplianceViolation v : complianceRepo.findAll()) {
            sb.append(String.format("%d,\"%s\",\"%s\",\"%s\",%d,%d,%d,\"%s\",\"%s\",\"%s\"\n",
                    v.getId(),
                    v.getInstitution().getName().replace("\"", "\"\""),
                    v.getProgramme() != null ? v.getProgramme().getName().replace("\"", "\"\"") : "Institution Level",
                    v.getAcademicYear(),
                    v.getApprovedIntake(),
                    v.getActualEnrolment(),
                    v.getExcessCount(),
                    v.getSeverity().name(),
                    v.getStatus().name(),
                    v.getNotes() != null ? v.getNotes().replace("\"", "\"\"") : ""));
        }

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"apaarix_compliance_violations.csv\"")
                .header("Content-Type", "text/csv")
                .body(sb.toString());
    }

    @PostMapping("/reset-demo")
    public ResponseEntity<ApiResponse<String>> resetDemoData() {
        seederService.resetAndSeed();
        return ResponseEntity.ok(ApiResponse.ok("Demo synthetic dataset reset to initial state successfully", "RESET_COMPLETE"));
    }
}

