package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.DuplicateAlert;
import com.apaarix.entity.Enrolment;
import com.apaarix.entity.Student;
import com.apaarix.enums.ConfidenceLevel;
import com.apaarix.enums.DuplicateReviewStatus;
import com.apaarix.repository.DuplicateAlertRepository;
import com.apaarix.repository.EnrolmentRepository;
import com.apaarix.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/v1/duplicates")
public class DuplicateController {

    @Autowired private DuplicateAlertRepository duplicateRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private StudentRepository studentRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DuplicateAlert>>> getDuplicates(
            @RequestParam(required = false) String status) {

        List<DuplicateAlert> list = duplicateRepo.findAll();
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            DuplicateReviewStatus rStatus = DuplicateReviewStatus.valueOf(status.toUpperCase());
            list = list.stream().filter(d -> d.getReviewStatus() == rStatus).toList();
        }

        return ResponseEntity.ok(ApiResponse.ok("Duplicate alerts retrieved", list));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<DuplicateAlert>> resolveAlert(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        DuplicateAlert alert = duplicateRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Alert not found with id: " + id));

        String decision = payload.get("decision"); // CONFIRMED_DUPLICATE, GENUINE, MANUAL_REVIEW
        String notes = payload.getOrDefault("notes", "Reviewed by AICTE Regulatory Cell");

        alert.setReviewStatus(DuplicateReviewStatus.valueOf(decision.toUpperCase()));
        alert.setResolutionNotes(notes);
        alert.setResolvedAt(Instant.now());

        DuplicateAlert saved = duplicateRepo.save(alert);
        return ResponseEntity.ok(ApiResponse.ok("Duplicate alert resolution recorded", saved));
    }

    @PostMapping("/scan")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runDuplicateScan() {
        List<Enrolment> enrolments = enrolmentRepo.findAll();
        Map<String, List<Enrolment>> apaarMap = new HashMap<>();

        for (Enrolment e : enrolments) {
            String apaar = e.getStudent().getApaarId();
            if (apaar != null) {
                apaarMap.computeIfAbsent(apaar, k -> new ArrayList<>()).add(e);
            }
        }

        int newAlerts = 0;
        for (Map.Entry<String, List<Enrolment>> entry : apaarMap.entrySet()) {
            List<Enrolment> list = entry.getValue();
            if (list.size() > 1) {
                Enrolment e1 = list.get(0);
                Enrolment e2 = list.get(1);

                if (!e1.getInstitution().getId().equals(e2.getInstitution().getId())) {
                    boolean alreadyExists = duplicateRepo.findAll().stream().anyMatch(d ->
                            d.getApaarId().equals(entry.getKey()) &&
                            d.getInstitutionA().getId().equals(e1.getInstitution().getId()) &&
                            d.getInstitutionB().getId().equals(e2.getInstitution().getId()));

                    if (!alreadyExists) {
                        DuplicateAlert alert = new DuplicateAlert(
                                e1.getStudent(), e1.getInstitution(),
                                e2.getStudent(), e2.getInstitution(),
                                entry.getKey(),
                                "Cross-institution APAAR multi-enrolment identified during automated registry sweep",
                                ConfidenceLevel.HIGH
                        );
                        duplicateRepo.save(alert);
                        newAlerts++;
                    }
                }
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("totalEnrolmentsScanned", enrolments.size());
        res.put("uniqueApaarCount", apaarMap.size());
        res.put("newAlertsDetected", newAlerts);

        return ResponseEntity.ok(ApiResponse.ok("Registry duplicate sweep completed", res));
    }
}

