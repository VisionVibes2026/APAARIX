package com.apaarix.entity;

import com.apaarix.enums.ConfidenceLevel;
import com.apaarix.enums.DuplicateReviewStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "duplicate_alerts")
public class DuplicateAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_a_id", nullable = false)
    private Student studentA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institution_a_id", nullable = false)
    private Institution institutionA;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_b_id", nullable = false)
    private Student studentB;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institution_b_id", nullable = false)
    private Institution institutionB;

    @Column(name = "apaar_id", length = 30)
    private String apaarId;

    @Column(name = "match_reason", nullable = false, length = 200)
    private String matchReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "confidence_level", nullable = false, length = 20)
    private ConfidenceLevel confidenceLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false, length = 30)
    private DuplicateReviewStatus reviewStatus = DuplicateReviewStatus.PENDING;

    @Column(name = "detected_at", nullable = false, updatable = false)
    private Instant detectedAt = Instant.now();

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "resolution_notes", length = 255)
    private String resolutionNotes;

    public DuplicateAlert() {}

    public DuplicateAlert(Student studentA, Institution institutionA, Student studentB, Institution institutionB, String apaarId, String matchReason, ConfidenceLevel confidenceLevel) {
        this.studentA = studentA;
        this.institutionA = institutionA;
        this.studentB = studentB;
        this.institutionB = institutionB;
        this.apaarId = apaarId;
        this.matchReason = matchReason;
        this.confidenceLevel = confidenceLevel;
        this.reviewStatus = DuplicateReviewStatus.PENDING;
        this.detectedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudentA() { return studentA; }
    public void setStudentA(Student studentA) { this.studentA = studentA; }
    public Institution getInstitutionA() { return institutionA; }
    public void setInstitutionA(Institution institutionA) { this.institutionA = institutionA; }
    public Student getStudentB() { return studentB; }
    public void setStudentB(Student studentB) { this.studentB = studentB; }
    public Institution getInstitutionB() { return institutionB; }
    public void setInstitutionB(Institution institutionB) { this.institutionB = institutionB; }
    public String getApaarId() { return apaarId; }
    public void setApaarId(String apaarId) { this.apaarId = apaarId; }
    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }
    public ConfidenceLevel getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(ConfidenceLevel confidenceLevel) { this.confidenceLevel = confidenceLevel; }
    public DuplicateReviewStatus getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(DuplicateReviewStatus reviewStatus) { this.reviewStatus = reviewStatus; }
    public Instant getDetectedAt() { return detectedAt; }
    public void setDetectedAt(Instant detectedAt) { this.detectedAt = detectedAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}

