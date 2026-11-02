package com.apaarix.service;

import com.apaarix.entity.*;
import com.apaarix.enums.*;
import com.apaarix.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Instant;
import java.util.*;

@Service
public class DataSeederService {

    @Autowired private InstitutionRepository institutionRepo;
    @Autowired private ProgrammeRepository programmeRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private EnrolmentRepository enrolmentRepo;
    @Autowired private ApaarVerificationRepository verificationRepo;
    @Autowired private DuplicateAlertRepository duplicateRepo;
    @Autowired private ComplianceViolationRepository complianceRepo;
    @Autowired private DigitalCredentialRepository credentialRepo;

    @PostConstruct
    public void init() {
        if (institutionRepo.count() == 0) {
            seedAll();
        }
    }

    @Transactional
    public void resetAndSeed() {
        credentialRepo.deleteAll();
        duplicateRepo.deleteAll();
        complianceRepo.deleteAll();
        verificationRepo.deleteAll();
        enrolmentRepo.deleteAll();
        studentRepo.deleteAll();
        programmeRepo.deleteAll();
        institutionRepo.deleteAll();

        seedAll();
    }

    private void seedAll() {
        // 1. Seed Institutions
        Institution dtu = new Institution("AICTE-1-1001", "Delhi Technological University", "Delhi", "New Delhi", "State Government", 1200, "dean.academics@dtu.ac.in", "+91-11-27871018", 98);
        Institution coep = new Institution("AICTE-1-1002", "COEP Technological University", "Maharashtra", "Pune", "State Autonomous", 960, "director@coeptech.ac.in", "+91-20-25507000", 96);
        Institution rvce = new Institution("AICTE-1-1003", "R.V. College of Engineering", "Karnataka", "Bengaluru", "Private Autonomous", 1100, "principal@rvce.edu.in", "+91-80-68188111", 94);
        Institution psg = new Institution("AICTE-1-1004", "PSG College of Technology", "Tamil Nadu", "Coimbatore", "Govt Aided Autonomous", 1050, "principal@psgtech.edu", "+91-422-2572177", 97);
        Institution jadavpur = new Institution("AICTE-1-1005", "Jadavpur University Faculty of Engg", "West Bengal", "Kolkata", "State University", 900, "dean.engg@jadavpuruniversity.in", "+91-33-24146666", 95);
        Institution vjti = new Institution("AICTE-1-1006", "Veermata Jijabai Technological Institute", "Maharashtra", "Mumbai", "State Autonomous", 840, "director@vjti.ac.in", "+91-22-24198101", 99);
        Institution bmsce = new Institution("AICTE-1-1007", "B.M.S. College of Engineering", "Karnataka", "Bengaluru", "Private Autonomous", 1150, "principal@bmsce.ac.in", "+91-80-26622130", 92);
        Institution thapar = new Institution("AICTE-1-1008", "Thapar Institute of Engg & Technology", "Punjab", "Patiala", "Deemed University", 1400, "registrar@thapar.edu", "+91-175-2393021", 86);
        Institution mitwpu = new Institution("AICTE-1-1009", "MIT World Peace University", "Maharashtra", "Pune", "Private University", 1300, "admissions@mitwpu.edu.in", "+91-20-71177104", 82);
        Institution cbit = new Institution("AICTE-1-1010", "Chaitanya Bharathi Institute of Tech", "Telangana", "Hyderabad", "Private Autonomous", 1020, "principal@cbit.ac.in", "+91-40-24193276", 95);

        List<Institution> institutions = List.of(dtu, coep, rvce, psg, jadavpur, vjti, bmsce, thapar, mitwpu, cbit);
        institutionRepo.saveAll(institutions);

        // 2. Seed Programmes for each institution
        List<Programme> programmes = new ArrayList<>();
        String[] pCodes = {"CSE", "ECE", "MECH", "IT", "AIDS", "CIVIL"};
        String[] pNames = {"Computer Science & Engineering", "Electronics & Communication Engg", "Mechanical Engineering", "Information Technology", "Artificial Intelligence & Data Science", "Civil Engineering"};
        int[] pIntakes = {180, 120, 120, 120, 60, 60};

        for (Institution inst : institutions) {
            for (int i = 0; i < pCodes.length; i++) {
                programmes.add(new Programme(inst.getCode() + "-" + pCodes[i], pNames[i], "UG", pIntakes[i], inst));
            }
        }
        programmeRepo.saveAll(programmes);

        // 3. Seed Students & Enrolments (~100 realistic records)
        String[] firstNames = {
            "Aarav", "Ananya", "Rohan", "Pooja", "Vikram", "Sneha", "Aditya", "Priyanka", "Karthik", "Divya",
            "Siddharth", "Neha", "Arjun", "Tanvi", "Rahul", "Isha", "Manish", "Meera", "Gaurav", "Shreya",
            "Kunal", "Riya", "Harish", "Deepika", "Naveen", "Swati", "Suresh", "Kavya", "Akash", "Bhavna",
            "Vishal", "Preeti", "Sanjay", "Anjali", "Varun", "Sunita", "Deepak", "Ritu", "Amit", "Rashmi",
            "Nikhil", "Simran", "Rajesh", "Pooja", "Alok", "Komal", "Mayank", "Sandhya", "Pranav", "Nidhi"
        };
        String[] lastNames = {
            "Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Kulkarni", "Mukherjee", "Chatterjee", "Gupta",
            "Singh", "Choudhury", "Joshi", "Bose", "Mehta", "Deshmukh", "Menon", "Pillai", "Rao", "Hegde",
            "Bhat", "Chauhan", "Bansal", "Aggarwal", "Saxena", "Mishra", "Pandey", "Ghosh", "Das", "Sen"
        };

        Random rnd = new Random(42);
        List<Student> studentList = new ArrayList<>();
        List<Enrolment> enrolmentList = new ArrayList<>();
        List<ApaarVerification> verificationList = new ArrayList<>();
        List<DigitalCredential> credentialList = new ArrayList<>();

        for (int i = 1; i <= 90; i++) {
            String fName = firstNames[rnd.nextInt(firstNames.length)];
            String lName = lastNames[rnd.nextInt(lastNames.length)];
            String fullName = fName + " " + lName;
            String stuId = String.format("STU-2024-%04d", i);

            // Generate APAAR ID (format XXXX-XXXX-XXXX)
            // Inject a few intentionally invalid or pending IDs for testing
            String apaarId;
            VerificationStatus vStatus;
            String remark;
            double confidence;

            if (i == 13 || i == 37) {
                // Invalid APAAR ID (starts with 9999)
                apaarId = String.format("9999-%04d-%04d", rnd.nextInt(9000) + 1000, rnd.nextInt(9000) + 1000);
                vStatus = VerificationStatus.INVALID;
                remark = "Identity mismatch: APAAR ID not registered in ABC/DigiLocker repository.";
                confidence = 0.12;
            } else if (i == 24 || i == 58) {
                // Manual Review (starts with 8888)
                apaarId = String.format("8888-%04d-%04d", rnd.nextInt(9000) + 1000, rnd.nextInt(9000) + 1000);
                vStatus = VerificationStatus.MANUAL_REVIEW;
                remark = "Aadhaar demographic mismatch: Middle name missing in institution admission docket.";
                confidence = 0.68;
            } else if (i % 7 == 0) {
                // Pending verification
                apaarId = String.format("%04d-%04d-%04d", rnd.nextInt(7000) + 1000, rnd.nextInt(9000) + 1000, rnd.nextInt(9000) + 1000);
                vStatus = VerificationStatus.PENDING;
                remark = "Awaiting verification response from National Academic Depository.";
                confidence = 0.50;
            } else {
                // Verified
                apaarId = String.format("%04d-%04d-%04d", rnd.nextInt(7000) + 1000, rnd.nextInt(9000) + 1000, rnd.nextInt(9000) + 1000);
                vStatus = VerificationStatus.VERIFIED;
                remark = "Academic identity verified against National ABC repository.";
                confidence = 0.98;
            }

            LocalDate dob = LocalDate.of(2003 + rnd.nextInt(4), rnd.nextInt(12) + 1, rnd.nextInt(28) + 1);
            String gender = (i % 3 == 0) ? "Female" : "Male";
            String email = fName.toLowerCase() + "." + lName.toLowerCase() + i + "@example.edu.in";
            String mobile = "+91-9" + String.format("%09d", rnd.nextInt(1000000000));
            String fatherName = "Mr. " + firstNames[rnd.nextInt(firstNames.length)] + " " + lName;

            Student student = new Student(stuId, apaarId, fullName, dob, gender, email, mobile, fatherName);
            studentList.add(student);

            // Enrolment
            Institution inst = institutions.get(i % institutions.size());
            List<Programme> instProgs = programmes.stream().filter(p -> p.getInstitution().getId().equals(inst.getId())).toList();
            Programme prog = instProgs.get(rnd.nextInt(instProgs.size()));
            String ay = (i % 4 == 0) ? "2023-2024" : "2024-2025";
            AdmissionCategory cat = AdmissionCategory.values()[rnd.nextInt(AdmissionCategory.values().length)];

            Enrolment enrolment = new Enrolment(student, inst, prog, ay, LocalDate.of(2024, 8, 1 + rnd.nextInt(15)), cat, EnrolmentStatus.ACTIVE);
            enrolmentList.add(enrolment);

            // Verification Record
            ApaarVerification ver = new ApaarVerification(apaarId, student, vStatus, confidence, remark);
            verificationList.add(ver);

            // Digital Credential for verified records
            if (vStatus == VerificationStatus.VERIFIED) {
                String credId = "CRD-2024-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                String qrData = String.format("{\"credentialId\":\"%s\",\"studentId\":\"%s\",\"apaarId\":\"%s\",\"institution\":\"%s\",\"programme\":\"%s\",\"status\":\"VERIFIED\"}",
                        credId, stuId, apaarId.substring(0, 4) + "-XXXX-" + apaarId.substring(10), inst.getName(), prog.getName());
                String sigHash = Integer.toHexString((credId + apaarId + stuId).hashCode()) + "7f8b9c0d1e2f";
                DigitalCredential cred = new DigitalCredential(credId, student, enrolment, LocalDate.now().minusDays(rnd.nextInt(60)), qrData, sigHash);
                credentialList.add(cred);
            }
        }

        studentRepo.saveAll(studentList);
        enrolmentRepo.saveAll(enrolmentList);
        verificationRepo.saveAll(verificationList);
        credentialRepo.saveAll(credentialList);

        // 4. Seed Intentional Cross-Institution Duplicate Enrolments for intelligence testing
        // Duplicate 1: Aarav Sharma enrolled at DTU and RVCE with the SAME APAAR ID
        Student dupStu1 = studentList.get(0);
        Institution rvceInst = rvce;
        Programme rvceProg = programmes.stream().filter(p -> p.getInstitution().getId().equals(rvceInst.getId()) && p.getCode().contains("CSE")).findFirst().orElse(programmes.get(12));
        Enrolment dupEnrolment1 = new Enrolment(dupStu1, rvceInst, rvceProg, "2024-2025", LocalDate.of(2024, 8, 10), AdmissionCategory.GENERAL, EnrolmentStatus.ACTIVE);
        enrolmentRepo.save(dupEnrolment1);

        DuplicateAlert alert1 = new DuplicateAlert(
                dupStu1, dtu,
                dupStu1, rvceInst,
                dupStu1.getApaarId(),
                "Exact APAAR ID and identity match across two distinct technical institutions for full-time regular degree.",
                ConfidenceLevel.HIGH
        );

        // Duplicate 2: Ananya Verma enrolled at COEP and MIT-WPU
        Student dupStu2 = studentList.get(1);
        Institution mitInst = mitwpu;
        Programme mitProg = programmes.stream().filter(p -> p.getInstitution().getId().equals(mitInst.getId())).findFirst().orElse(programmes.get(48));
        Enrolment dupEnrolment2 = new Enrolment(dupStu2, mitInst, mitProg, "2024-2025", LocalDate.of(2024, 8, 12), AdmissionCategory.OBC, EnrolmentStatus.ACTIVE);
        enrolmentRepo.save(dupEnrolment2);

        DuplicateAlert alert2 = new DuplicateAlert(
                dupStu2, coep,
                dupStu2, mitInst,
                dupStu2.getApaarId(),
                "APAAR ID multi-tenancy detected: Concurrent regular enrolment in B.Tech programmes.",
                ConfidenceLevel.HIGH
        );

        // Duplicate 3: Near-match / Fuzzy match (Pending review)
        Student dupStu3A = studentList.get(2);
        Student dupStu3B = studentList.get(3);
        DuplicateAlert alert3 = new DuplicateAlert(
                dupStu3A, bmsce,
                dupStu3B, psg,
                dupStu3A.getApaarId(),
                "Duplicate admission record submitted under different institutional registration tokens.",
                ConfidenceLevel.MEDIUM
        );

        duplicateRepo.saveAll(List.of(alert1, alert2, alert3));

        // 5. Seed SeatGuard Compliance Violations (Excess intake)
        // Violation 1: MIT World Peace University - B.Tech AI & Data Science
        Programme mitAids = programmes.stream()
                .filter(p -> p.getInstitution().getId().equals(mitwpu.getId()) && p.getCode().contains("AIDS"))
                .findFirst().orElse(programmes.get(48));
        ComplianceViolation v1 = new ComplianceViolation(
                mitwpu, mitAids, "2024-2025", 60, 72, 12, ViolationSeverity.CRITICAL,
                "SeatGuard Alert: Actual admitted candidates exceed AICTE approved ceiling by 12 seats (20.0% excess intake)."
        );

        // Violation 2: Thapar Institute - B.Tech Computer Science
        Programme thaparCse = programmes.stream()
                .filter(p -> p.getInstitution().getId().equals(thapar.getId()) && p.getCode().contains("CSE"))
                .findFirst().orElse(programmes.get(42));
        ComplianceViolation v2 = new ComplianceViolation(
                thapar, thaparCse, "2024-2025", 180, 191, 11, ViolationSeverity.HIGH,
                "SeatGuard Alert: NRI and supernumerary quota exceeds permissible 15% statutory threshold."
        );

        // Violation 3: BMSCE - Information Technology (Resolved violation for historical compliance log)
        Programme bmsceIt = programmes.stream()
                .filter(p -> p.getInstitution().getId().equals(bmsce.getId()) && p.getCode().contains("IT"))
                .findFirst().orElse(programmes.get(36));
        ComplianceViolation v3 = new ComplianceViolation(
                bmsce, bmsceIt, "2023-2024", 120, 124, 4, ViolationSeverity.MEDIUM,
                "Minor quota overflow in Lateral Entry category. Rectified after State DTE reconciliation."
        );
        v3.setStatus(ViolationStatus.RESOLVED);

        complianceRepo.saveAll(List.of(v1, v2, v3));
    }
}

