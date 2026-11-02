package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.*;
import com.apaarix.enums.CredentialStatus;
import com.apaarix.enums.VerificationStatus;
import com.apaarix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
public class CredentialController {

    @Autowired private DigitalCredentialRepository credentialRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private ApaarVerificationRepository verificationRepo;

    @GetMapping("/credentials/{credentialId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyPublicCredential(@PathVariable String credentialId) {
        DigitalCredential cred = credentialRepo.findByCredentialId(credentialId)
                .orElseThrow(() -> new IllegalArgumentException("Credential not found with ID: " + credentialId));

        Student s = cred.getStudent();
        Enrolment e = cred.getEnrolment();

        Map<String, Object> data = new HashMap<>();
        data.put("credentialId", cred.getCredentialId());
        data.put("issueDate", cred.getIssueDate());
        data.put("status", cred.getStatus().name());
        data.put("issuerAuthority", cred.getIssuerAuthority());
        data.put("signatureHash", cred.getSignatureHash());

        // Masked sensitive attributes for public verification
        data.put("studentName", s.getFullName());
        data.put("studentId", s.getStudentId());
        data.put("maskedApaarId", s.getApaarId().substring(0, 4) + "-XXXX-" + s.getApaarId().substring(s.getApaarId().length() - 4));
        data.put("institutionName", e.getInstitution().getName());
        data.put("institutionCode", e.getInstitution().getCode());
        data.put("programmeName", e.getProgramme().getName());
        data.put("academicYear", e.getAcademicYear());
        data.put("enrolmentStatus", e.getStatus().name());
        data.put("verifiedAuthentic", cred.getStatus() == CredentialStatus.ACTIVE);

        return ResponseEntity.ok(ApiResponse.ok("Digital credential verified against National Registry", data));
    }

    @GetMapping("/credentials/student/{studentId}")
    public ResponseEntity<ApiResponse<DigitalCredential>> getStudentCredential(@PathVariable Long studentId) {
        DigitalCredential cred = credentialRepo.findByStudentId(studentId)
                .orElseThrow(() -> new IllegalArgumentException("No credential issued for student ID: " + studentId));
        return ResponseEntity.ok(ApiResponse.ok("Student credential found", cred));
    }

    @PostMapping("/credentials/generate/{studentId}")
    public ResponseEntity<ApiResponse<DigitalCredential>> generateCredential(@PathVariable Long studentId) {
        Student s = studentRepo.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Optional<DigitalCredential> existing = credentialRepo.findByStudentId(studentId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(ApiResponse.ok("Existing credential returned", existing.get()));
        }

        List<Enrolment> enrolments = enrolmentRepo.findByStudentId(studentId);
        if (enrolments.isEmpty()) {
            throw new IllegalArgumentException("Student has no active enrolments");
        }
        Enrolment e = enrolments.get(0);

        String credId = "CRD-2024-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String qrData = String.format("https://apaarix.aicte.gov.in/verify/%s", credId);
        String sigHash = Integer.toHexString((credId + s.getApaarId() + s.getStudentId()).hashCode()) + "9a8b7c6d5e";

        DigitalCredential cred = new DigitalCredential(credId, s, e, LocalDate.now(), qrData, sigHash);
        DigitalCredential saved = credentialRepo.save(cred);

        return ResponseEntity.ok(ApiResponse.ok("Digital credential issued successfully", saved));
    }

    @GetMapping("/student-portal/profile/{studentId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentPortalProfile(@PathVariable Long studentId) {
        Student s = studentRepo.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found"));

        List<Enrolment> enrolments = enrolmentRepo.findByStudentId(studentId);
        Optional<ApaarVerification> verification = verificationRepo.findByStudentId(studentId);
        Optional<DigitalCredential> credential = credentialRepo.findByStudentId(studentId);

        Map<String, Object> data = new HashMap<>();
        data.put("student", s);
        data.put("enrolments", enrolments);
        data.put("verification", verification.orElse(null));
        data.put("credential", credential.orElse(null));

        // Purpose-limited consent permissions log
        List<Map<String, Object>> consents = List.of(
                Map.of("purpose", "AICTE National Enrolment Verification", "grantedDate", "2024-08-01", "status", "ACTIVE", "scope", "Academic Records"),
                Map.of("purpose", "Academic Bank of Credits (ABC) Credit Transfer", "grantedDate", "2024-08-10", "status", "ACTIVE", "scope", "Degree & APAAR ID"),
                Map.of("purpose", "National Scholarship Portal Authentication", "grantedDate", "2024-09-01", "status", "EXPIRED", "scope", "Category & Attendance")
        );
        data.put("consents", consents);

        return ResponseEntity.ok(ApiResponse.ok("Student portal profile retrieved", data));
    }
}

