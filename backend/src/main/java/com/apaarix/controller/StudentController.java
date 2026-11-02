package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.*;
import com.apaarix.enums.AdmissionCategory;
import com.apaarix.enums.EnrolmentStatus;
import com.apaarix.enums.VerificationStatus;
import com.apaarix.integration.MockApaarAdapter;
import com.apaarix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private ApaarVerificationRepository verificationRepo;
    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private ProgrammeRepository programmeRepo;
    @Autowired private DigitalCredentialRepository credentialRepo;
    @Autowired private MockApaarAdapter apaarAdapter;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long institutionId,
            @RequestParam(required = false) String verificationStatus,
            @RequestParam(required = false) String academicYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<Enrolment> enrolments = enrolmentRepo.findAll();

        // Apply filters
        if (institutionId != null) {
            enrolments = enrolments.stream().filter(e -> e.getInstitution().getId().equals(institutionId)).toList();
        }
        if (academicYear != null && !academicYear.equalsIgnoreCase("ALL")) {
            enrolments = enrolments.stream().filter(e -> e.getAcademicYear().equalsIgnoreCase(academicYear)).toList();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Enrolment e : enrolments) {
            Student s = e.getStudent();
            Optional<ApaarVerification> vOpt = verificationRepo.findByStudentId(s.getId());
            VerificationStatus vStatus = vOpt.map(ApaarVerification::getStatus).orElse(VerificationStatus.PENDING);

            if (verificationStatus != null && !verificationStatus.equalsIgnoreCase("ALL")) {
                if (!vStatus.name().equalsIgnoreCase(verificationStatus)) {
                    continue;
                }
            }

            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matches = s.getFullName().toLowerCase().contains(q) ||
                        s.getStudentId().toLowerCase().contains(q) ||
                        s.getApaarId().replace("-", "").contains(q.replace("-", "")) ||
                        e.getInstitution().getName().toLowerCase().contains(q) ||
                        e.getProgramme().getName().toLowerCase().contains(q);
                if (!matches) continue;
            }

            Map<String, Object> item = new HashMap<>();
            item.put("enrolmentId", e.getId());
            item.put("studentId", s.getStudentId());
            item.put("id", s.getId());
            item.put("fullName", s.getFullName());
            item.put("apaarId", s.getApaarId());
            item.put("maskedApaar", s.getApaarId() != null && s.getApaarId().length() >= 10 ?
                    s.getApaarId().substring(0, 4) + "-XXXX-" + s.getApaarId().substring(s.getApaarId().length() - 4) : s.getApaarId());
            item.put("institutionId", e.getInstitution().getId());
            item.put("institutionName", e.getInstitution().getName());
            item.put("programmeName", e.getProgramme().getName());
            item.put("academicYear", e.getAcademicYear());
            item.put("admissionCategory", e.getAdmissionCategory().name());
            item.put("enrolmentStatus", e.getStatus().name());
            item.put("verificationStatus", vStatus.name());
            item.put("verificationConfidence", vOpt.map(ApaarVerification::getConfidenceScore).orElse(0.0));
            item.put("verificationRemarks", vOpt.map(ApaarVerification::getRemarks).orElse(""));
            result.add(item);
        }

        // In-memory pagination
        int totalElements = result.size();
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<Map<String, Object>> paged = result.subList(fromIndex, toIndex);

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("content", paged);
        responseData.put("totalElements", totalElements);
        responseData.put("totalPages", (int) Math.ceil((double) totalElements / size));
        responseData.put("currentPage", page);
        responseData.put("pageSize", size);

        return ResponseEntity.ok(ApiResponse.ok("Students retrieved successfully", responseData));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentDetail(@PathVariable Long id) {
        Student student = studentRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student record not found with id: " + id));

        List<Enrolment> enrolments = enrolmentRepo.findByStudentId(id);
        Optional<ApaarVerification> verification = verificationRepo.findByStudentId(id);
        Optional<DigitalCredential> credential = credentialRepo.findByStudentId(id);

        Map<String, Object> data = new HashMap<>();
        data.put("student", student);
        data.put("enrolments", enrolments);
        data.put("verification", verification.orElse(null));
        data.put("credential", credential.orElse(null));

        return ResponseEntity.ok(ApiResponse.ok("Student details retrieved", data));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> registerStudent(@RequestBody Map<String, Object> payload) {
        String fullName = (String) payload.get("fullName");
        String apaarId = (String) payload.get("apaarId");
        String email = (String) payload.get("email");
        String mobile = (String) payload.get("mobileNumber");
        String dobStr = (String) payload.get("dateOfBirth");
        String gender = (String) payload.get("gender");
        Long institutionId = Long.valueOf(payload.get("institutionId").toString());
        Long programmeId = Long.valueOf(payload.get("programmeId").toString());
        String academicYear = (String) payload.getOrDefault("academicYear", "2024-2025");
        String categoryStr = (String) payload.getOrDefault("admissionCategory", "GENERAL");

        if (fullName == null || apaarId == null) {
            throw new IllegalArgumentException("Full name and APAAR ID are required.");
        }

        apaarId = apaarAdapter.normalize(apaarId);
        LocalDate dob = dobStr != null ? LocalDate.parse(dobStr) : LocalDate.of(2004, 1, 1);
        String studentId = "STU-" + System.currentTimeMillis() % 1000000;

        Student student = new Student(studentId, apaarId, fullName, dob, gender, email, mobile, "Not Provided");
        Student savedStudent = studentRepo.save(student);

        Institution inst = institutionRepo.findById(institutionId)
                .orElseThrow(() -> new IllegalArgumentException("Institution not found"));
        Programme prog = programmeRepo.findById(programmeId)
                .orElseThrow(() -> new IllegalArgumentException("Programme not found"));

        AdmissionCategory cat = AdmissionCategory.valueOf(categoryStr.toUpperCase());
        Enrolment enrolment = new Enrolment(savedStudent, inst, prog, academicYear, LocalDate.now(), cat, EnrolmentStatus.ACTIVE);
        Enrolment savedEnrolment = enrolmentRepo.save(enrolment);

        // Run mock verification
        MockApaarAdapter.VerificationResult vRes = apaarAdapter.verifyWithGateway(apaarId, fullName);
        ApaarVerification verification = new ApaarVerification(apaarId, savedStudent, vRes.getStatus(), vRes.getConfidence(), vRes.getMessage());
        ApaarVerification savedVer = verificationRepo.save(verification);

        Map<String, Object> resp = new HashMap<>();
        resp.put("student", savedStudent);
        resp.put("enrolment", savedEnrolment);
        resp.put("verification", savedVer);

        return ResponseEntity.ok(ApiResponse.ok("Student enrolled and APAAR verification triggered", resp));
    }
}

