package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.Institution;
import com.apaarix.entity.Programme;
import com.apaarix.repository.ComplianceViolationRepository;
import com.apaarix.repository.EnrolmentRepository;
import com.apaarix.repository.InstitutionRepository;
import com.apaarix.repository.ProgrammeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/institutions")
public class InstitutionController {

    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private ProgrammeRepository programmeRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private ComplianceViolationRepository violationRepo;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getInstitutions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state) {

        List<Institution> list = institutionRepo.findAllByOrderByApprovedIntakeDesc();

        if (search != null && !search.trim().isEmpty()) {
            String q = search.trim().toLowerCase();
            list = list.stream().filter(i ->
                    i.getName().toLowerCase().contains(q) ||
                    i.getCode().toLowerCase().contains(q) ||
                    i.getCity().toLowerCase().contains(q)
            ).toList();
        }

        if (state != null && !state.trim().isEmpty() && !state.equalsIgnoreCase("ALL")) {
            list = list.stream().filter(i -> i.getState().equalsIgnoreCase(state.trim())).toList();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Institution inst : list) {
            long enrolled = enrolmentRepo.countByInstitutionId(inst.getId());
            double util = inst.getApprovedIntake() > 0 ? ((double) enrolled / inst.getApprovedIntake()) * 100.0 : 0;

            Map<String, Object> map = new HashMap<>();
            map.put("id", inst.getId());
            map.put("code", inst.getCode());
            map.put("name", inst.getName());
            map.put("state", inst.getState());
            map.put("city", inst.getCity());
            map.put("institutionType", inst.getInstitutionType());
            map.put("approvedIntake", inst.getApprovedIntake());
            map.put("contactEmail", inst.getContactEmail());
            map.put("contactPhone", inst.getContactPhone());
            map.put("complianceScore", inst.getComplianceScore());
            map.put("active", inst.isActive());
            map.put("enrolmentCount", enrolled);
            map.put("seatUtilization", Math.round(util * 10.0) / 10.0);
            result.add(map);
        }

        return ResponseEntity.ok(ApiResponse.ok("Institutions fetched successfully", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInstitutionDetail(@PathVariable Long id) {
        Institution inst = institutionRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found with id: " + id));

        List<Programme> progs = programmeRepo.findByInstitutionId(id);
        long totalEnrolment = enrolmentRepo.countByInstitutionId(id);

        List<Map<String, Object>> progDetails = new ArrayList<>();
        for (Programme p : progs) {
            long pCount = enrolmentRepo.countByProgrammeId(p.getId());
            progDetails.add(Map.of(
                    "id", p.getId(),
                    "code", p.getCode(),
                    "name", p.getName(),
                    "degreeLevel", p.getDegreeLevel(),
                    "approvedIntake", p.getApprovedIntake(),
                    "enrolledCount", pCount,
                    "utilization", p.getApprovedIntake() > 0 ? Math.round(((double) pCount / p.getApprovedIntake()) * 1000.0) / 10.0 : 0
            ));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("institution", inst);
        data.put("programmes", progDetails);
        data.put("totalEnrolment", totalEnrolment);
        data.put("violations", violationRepo.findByInstitutionId(id));

        return ResponseEntity.ok(ApiResponse.ok("Institution details retrieved", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Institution>> createInstitution(@RequestBody Institution institution) {
        if (institution.getCode() == null || institution.getName() == null) {
            throw new IllegalArgumentException("Institution code and name are required");
        }
        Institution saved = institutionRepo.save(institution);
        return ResponseEntity.ok(ApiResponse.ok("Institution registered successfully", saved));
    }
}

