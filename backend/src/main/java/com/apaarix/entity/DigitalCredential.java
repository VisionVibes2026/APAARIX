package com.apaarix.entity;

import com.apaarix.enums.CredentialStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "digital_credentials")
public class DigitalCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "credential_id", nullable = false, unique = true, length = 60)
    private String credentialId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enrolment_id", nullable = false)
    private Enrolment enrolment;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CredentialStatus status = CredentialStatus.ACTIVE;

    @Column(name = "qr_data", columnDefinition = "TEXT")
    private String qrData;

    @Column(name = "signature_hash", length = 128)
    private String signatureHash;

    @Column(name = "issuer_authority", length = 150)
    private String issuerAuthority = "AICTE — National Student Academic Registry";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public DigitalCredential() {}

    public DigitalCredential(String credentialId, Student student, Enrolment enrolment, LocalDate issueDate, String qrData, String signatureHash) {
        this.credentialId = credentialId;
        this.student = student;
        this.enrolment = enrolment;
        this.issueDate = issueDate;
        this.status = CredentialStatus.ACTIVE;
        this.qrData = qrData;
        this.signatureHash = signatureHash;
        this.issuerAuthority = "AICTE — National Student Academic Registry";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCredentialId() { return credentialId; }
    public void setCredentialId(String credentialId) { this.credentialId = credentialId; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Enrolment getEnrolment() { return enrolment; }
    public void setEnrolment(Enrolment enrolment) { this.enrolment = enrolment; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public CredentialStatus getStatus() { return status; }
    public void setStatus(CredentialStatus status) { this.status = status; }
    public String getQrData() { return qrData; }
    public void setQrData(String qrData) { this.qrData = qrData; }
    public String getSignatureHash() { return signatureHash; }
    public void setSignatureHash(String signatureHash) { this.signatureHash = signatureHash; }
    public String getIssuerAuthority() { return issuerAuthority; }
    public void setIssuerAuthority(String issuerAuthority) { this.issuerAuthority = issuerAuthority; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

