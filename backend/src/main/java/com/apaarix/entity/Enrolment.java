package com.apaarix.entity;

import com.apaarix.enums.AdmissionCategory;
import com.apaarix.enums.EnrolmentStatus;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "enrolments")
public class Enrolment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "programme_id", nullable = false)
    private Programme programme;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "enrolment_date", nullable = false)
    private LocalDate enrolmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "admission_category", nullable = false, length = 30)
    private AdmissionCategory admissionCategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EnrolmentStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Enrolment() {}

    public Enrolment(Student student, Institution institution, Programme programme, String academicYear, LocalDate enrolmentDate, AdmissionCategory admissionCategory, EnrolmentStatus status) {
        this.student = student;
        this.institution = institution;
        this.programme = programme;
        this.academicYear = academicYear;
        this.enrolmentDate = enrolmentDate;
        this.admissionCategory = admissionCategory;
        this.status = status;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }
    public Programme getProgramme() { return programme; }
    public void setProgramme(Programme programme) { this.programme = programme; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public LocalDate getEnrolmentDate() { return enrolmentDate; }
    public void setEnrolmentDate(LocalDate enrolmentDate) { this.enrolmentDate = enrolmentDate; }
    public AdmissionCategory getAdmissionCategory() { return admissionCategory; }
    public void setAdmissionCategory(AdmissionCategory admissionCategory) { this.admissionCategory = admissionCategory; }
    public EnrolmentStatus getStatus() { return status; }
    public void setStatus(EnrolmentStatus status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

