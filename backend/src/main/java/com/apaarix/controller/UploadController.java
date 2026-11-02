package com.apaarix.controller;

import com.apaarix.dto.ApiResponse;
import com.apaarix.entity.*;
import com.apaarix.enums.AdmissionCategory;
import com.apaarix.enums.ConfidenceLevel;
import com.apaarix.enums.EnrolmentStatus;
import com.apaarix.integration.MockApaarAdapter;
import com.apaarix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private ProgrammeRepository programmeRepo;
    @Autowired private ApaarVerificationRepository verificationRepo;
    @Autowired private DuplicateAlertRepository duplicateRepo;
    @Autowired private MockApaarAdapter apaarAdapter;

    @GetMapping("/template")
    public ResponseEntity<String> getCsvTemplate() {
        String csv = "fullName,apaarId,dateOfBirth,gender,email,mobileNumber,admissionCategory\n" +
                "Harshavardhan Rao,7821-4567-9012,2004-05-14,Male,harsha.rao@example.com,+91-9876543210,GENERAL\n" +
                "Kavita Deshmukh,6712-3456-8901,2003-11-22,Female,kavita.d@example.com,+91-9876543211,OBC\n" +
                "Ritesh Agarwal,5601-2345-7890,2004-02-18,Male,ritesh.a@example.com,+91-9876543212,EWS\n";
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"apaarix_student_template.csv\"")
                .header("Content-Type", "text/csv")
                .body(csv);
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateBatch(@RequestBody Map<String, Object> request) {
        Long institutionId = Long.valueOf(request.get("institutionId").toString());
        Long programmeId = Long.valueOf(request.get("programmeId").toString());
        String academicYear = (String) request.getOrDefault("academicYear", "2024-2025");
        @SuppressWarnings("unchecked")
        List<Map<String, String>> rows = (List<Map<String, String>>) request.get("records");

        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException("No records provided in upload batch");
        }

        List<Map<String, Object>> validRecords = new ArrayList<>();
        List<Map<String, Object>> invalidRecords = new ArrayList<>();
        List<Map<String, Object>> duplicateRecords = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            Map<String, String> row = rows.get(i);
            String fullName = row.get("fullName");
            String apaarId = row.get("apaarId");
            String dob = row.get("dateOfBirth");
            String gender = row.getOrDefault("gender", "Other");
            String email = row.get("email");
            String mobile = row.get("mobileNumber");
            String category = row.getOrDefault("admissionCategory", "GENERAL");

            Map<String, Object> processed = new HashMap<>(row);
            processed.put("rowNumber", i + 1);

            // Validation 1: Missing essential fields
            if (fullName == null || fullName.trim().isEmpty() || apaarId == null || apaarId.trim().isEmpty()) {
                processed.put("error", "Full name and APAAR ID are mandatory fields.");
                invalidRecords.add(processed);
                continue;
            }

            // Validation 2: APAAR format check
            if (!apaarAdapter.validateFormat(apaarId)) {
                processed.put("error", "Invalid APAAR ID format. Must contain 12 numeric digits.");
                invalidRecords.add(processed);
                continue;
            }

            String normApaar = apaarAdapter.normalize(apaarId);
            processed.put("normalizedApaar", normApaar);

            // Validation 3: Duplicate detection against database
            Optional<Student> existingStudent = studentRepo.findByApaarId(normApaar);
            if (existingStudent.isPresent()) {
                Student ex = existingStudent.get();
                List<Enrolment> existingEnrolments = enrolmentRepo.findByStudentId(ex.getId());
                String existingInst = existingEnrolments.isEmpty() ? "Unknown" : existingEnrolments.get(0).getInstitution().getName();

                processed.put("duplicateWith", ex.getFullName());
                processed.put("existingInstitution", existingInst);
                processed.put("matchReason", "APAAR ID " + normApaar + " is already enrolled in " + existingInst);
                duplicateRecords.add(processed);
            } else {
                validRecords.add(processed);
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRecords", rows.size());
        summary.put("validCount", validRecords.size());
        summary.put("invalidCount", invalidRecords.size());
        summary.put("duplicateCount", duplicateRecords.size());
        summary.put("validRecords", validRecords);
        summary.put("invalidRecords", invalidRecords);
        summary.put("duplicateRecords", duplicateRecords);

        return ResponseEntity.ok(ApiResponse.ok("Batch records validated", summary));
    }

    @PostMapping("/commit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> commitBatch(@RequestBody Map<String, Object> request) {
        Long institutionId = Long.valueOf(request.get("institutionId").toString());
        Long programmeId = Long.valueOf(request.get("programmeId").toString());
        String academicYear = (String) request.getOrDefault("academicYear", "2024-2025");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> validRecords = (List<Map<String, Object>>) request.get("records");

        Institution inst = institutionRepo.findById(institutionId)
                .orElseThrow(() -> new IllegalArgumentException("Target institution not found"));
        Programme prog = programmeRepo.findById(programmeId)
                .orElseThrow(() -> new IllegalArgumentException("Target programme not found"));

        int insertedCount = 0;
        for (Map<String, Object> r : validRecords) {
            String fullName = (String) r.get("fullName");
            String apaarId = apaarAdapter.normalize((String) r.get("apaarId"));
            String dobStr = (String) r.get("dateOfBirth");
            String gender = (String) r.getOrDefault("gender", "Other");
            String email = (String) r.get("email");
            String mobile = (String) r.get("mobileNumber");
            String catStr = (String) r.getOrDefault("admissionCategory", "GENERAL");

            LocalDate dob = dobStr != null ? LocalDate.parse(dobStr) : LocalDate.of(2004, 1, 1);
            String stuId = "STU-2024-" + String.format("%04d", (int)(studentRepo.count() + 1));

            Student student = new Student(stuId, apaarId, fullName, dob, gender, email, mobile, "Uploaded via Batch Ingestion");
            Student saved = studentRepo.save(student);

            AdmissionCategory cat = AdmissionCategory.valueOf(catStr.toUpperCase());
            Enrolment enrolment = new Enrolment(saved, inst, prog, academicYear, LocalDate.now(), cat, EnrolmentStatus.ACTIVE);
            enrolmentRepo.save(enrolment);

            // Trigger verification
            MockApaarAdapter.VerificationResult vRes = apaarAdapter.verifyWithGateway(apaarId, fullName);
            ApaarVerification ver = new ApaarVerification(apaarId, saved, vRes.getStatus(), vRes.getConfidence(), vRes.getMessage());
            verificationRepo.save(ver);

            insertedCount++;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("insertedCount", insertedCount);
        result.put("institutionName", inst.getName());
        result.put("programmeName", prog.getName());
        result.put("academicYear", academicYear);

        return ResponseEntity.ok(ApiResponse.ok("Batch committed successfully into student registry", result));
    }
}

