package com.apaarix.entity;

import com.apaarix.enums.VerificationStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "apaar_verifications")
public class ApaarVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "apaar_id", nullable = false, length = 30)
    private String apaarId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private VerificationStatus status;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(length = 255)
    private String remarks;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    public ApaarVerification() {}

    public ApaarVerification(String apaarId, Student student, VerificationStatus status, Double confidenceScore, String remarks) {
        this.apaarId = apaarId;
        this.student = student;
        this.status = status;
        this.confidenceScore = confidenceScore;
        this.remarks = remarks;
        this.verifiedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getApaarId() { return apaarId; }
    public void setApaarId(String apaarId) { this.apaarId = apaarId; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
}

