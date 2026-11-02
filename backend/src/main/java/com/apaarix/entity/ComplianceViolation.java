package com.apaarix.entity;

import com.apaarix.enums.ViolationSeverity;
import com.apaarix.enums.ViolationStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "compliance_violations")
public class ComplianceViolation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "programme_id")
    private Programme programme;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "approved_intake", nullable = false)
    private Integer approvedIntake;

    @Column(name = "actual_enrolment", nullable = false)
    private Integer actualEnrolment;

    @Column(name = "excess_count", nullable = false)
    private Integer excessCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ViolationSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ViolationStatus status = ViolationStatus.OPEN;

    @Column(length = 255)
    private String notes;

    @Column(name = "detected_at", nullable = false, updatable = false)
    private Instant detectedAt = Instant.now();

    public ComplianceViolation() {}

    public ComplianceViolation(Institution institution, Programme programme, String academicYear, Integer approvedIntake, Integer actualEnrolment, Integer excessCount, ViolationSeverity severity, String notes) {
        this.institution = institution;
        this.programme = programme;
        this.academicYear = academicYear;
        this.approvedIntake = approvedIntake;
        this.actualEnrolment = actualEnrolment;
        this.excessCount = excessCount;
        this.severity = severity;
        this.notes = notes;
        this.status = ViolationStatus.OPEN;
        this.detectedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }
    public Programme getProgramme() { return programme; }
    public void setProgramme(Programme programme) { this.programme = programme; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public Integer getApprovedIntake() { return approvedIntake; }
    public void setApprovedIntake(Integer approvedIntake) { this.approvedIntake = approvedIntake; }
    public Integer getActualEnrolment() { return actualEnrolment; }
    public void setActualEnrolment(Integer actualEnrolment) { this.actualEnrolment = actualEnrolment; }
    public Integer getExcessCount() { return excessCount; }
    public void setExcessCount(Integer excessCount) { this.excessCount = excessCount; }
    public ViolationSeverity getSeverity() { return severity; }
    public void setSeverity(ViolationSeverity severity) { this.severity = severity; }
    public ViolationStatus getStatus() { return status; }
    public void setStatus(ViolationStatus status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getDetectedAt() { return detectedAt; }
    public void setDetectedAt(Instant detectedAt) { this.detectedAt = detectedAt; }
}

