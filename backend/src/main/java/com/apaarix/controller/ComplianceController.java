package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.ComplianceViolation;
import com.apaarix.entity.Institution;
import com.apaarix.entity.Programme;
import com.apaarix.enums.ViolationSeverity;
import com.apaarix.enums.ViolationStatus;
import com.apaarix.repository.ComplianceViolationRepository;
import com.apaarix.repository.EnrolmentRepository;
import com.apaarix.repository.InstitutionRepository;
import com.apaarix.repository.ProgrammeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/compliance")
public class ComplianceController {

    @Autowired private ComplianceViolationRepository violationRepo;
    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private ProgrammeRepository programmeRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSeatGuardSummary() {
        long openCount = violationRepo.countByStatus(ViolationStatus.OPEN);
        long resolvedCount = violationRepo.countByStatus(ViolationStatus.RESOLVED);
        List<Institution> insts = institutionRepo.findAll();

        int totalApproved = insts.stream().mapToInt(Institution::getApprovedIntake).sum();
        long totalEnrolled = enrolmentRepo.count();

        double avgCompliance = insts.isEmpty() ? 100 : insts.stream().mapToInt(Institution::getComplianceScore).average().orElse(100);

        Map<String, Object> data = new HashMap<>();
        data.put("openViolations", openCount);
        data.put("resolvedViolations", resolvedCount);
        data.put("totalApprovedIntake", totalApproved);
        data.put("totalEnrolment", totalEnrolled);
        data.put("overallUtilization", totalApproved > 0 ? Math.round(((double) totalEnrolled / totalApproved) * 1000.0) / 10.0 : 0);
        data.put("averageComplianceScore", Math.round(avgCompliance * 10.0) / 10.0);

        return ResponseEntity.ok(ApiResponse.ok("SeatGuard compliance summary retrieved", data));
    }

    @GetMapping("/violations")
    public ResponseEntity<ApiResponse<List<ComplianceViolation>>> getViolations(
            @RequestParam(required = false) String status) {

        List<ComplianceViolation> list = violationRepo.findAll();
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            ViolationStatus vStatus = ViolationStatus.valueOf(status.toUpperCase());
            list = list.stream().filter(v -> v.getStatus() == vStatus).toList();
        }

        return ResponseEntity.ok(ApiResponse.ok("Compliance violations retrieved", list));
    }

    @PostMapping("/violations/{id}/resolve")
    public ResponseEntity<ApiResponse<ComplianceViolation>> resolveViolation(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        ComplianceViolation violation = violationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Violation not found with id: " + id));

        String notes = payload.getOrDefault("notes", "Resolved after regulatory review and penalty compliance");
        violation.setStatus(ViolationStatus.RESOLVED);
        violation.setNotes(notes);

        ComplianceViolation saved = violationRepo.save(violation);
        return ResponseEntity.ok(ApiResponse.ok("Compliance violation marked resolved", saved));
    }

    @GetMapping("/institution/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInstitutionCompliance(@PathVariable Long id) {
        Institution inst = institutionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found"));

        List<Programme> progs = programmeRepo.findByInstitutionId(id);
        List<Map<String, Object>> progAnalysis = new ArrayList<>();

        for (Programme p : progs) {
            long count = enrolmentRepo.countByProgrammeId(p.getId());
            boolean hasExcess = count > p.getApprovedIntake();

            Map<String, Object> item = new HashMap<>();
            item.put("programmeId", p.getId());
            item.put("code", p.getCode());
            item.put("name", p.getName());
            item.put("approvedIntake", p.getApprovedIntake());
            item.put("actualEnrolment", count);
            item.put("excessSeats", hasExcess ? count - p.getApprovedIntake() : 0);
            item.put("utilizationPercentage", p.getApprovedIntake() > 0 ? Math.round(((double) count / p.getApprovedIntake()) * 1000.0) / 10.0 : 0);
            item.put("compliant", !hasExcess);
            progAnalysis.add(item);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("institution", inst);
        result.put("programmes", progAnalysis);
        result.put("violations", violationRepo.findByInstitutionId(id));

        return ResponseEntity.ok(ApiResponse.ok("Institution compliance analysis retrieved", result));
    }
}

