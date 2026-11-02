package com.apaarix.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "institutions")
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "institution_type", length = 50)
    private String institutionType;

    @Column(name = "approved_intake", nullable = false)
    private Integer approvedIntake;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "compliance_score", nullable = false)
    private Integer complianceScore = 100;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Institution() {}

    public Institution(String code, String name, String state, String city, String institutionType, Integer approvedIntake, String contactEmail, String contactPhone, Integer complianceScore) {
        this.code = code;
        this.name = name;
        this.state = state;
        this.city = city;
        this.institutionType = institutionType;
        this.approvedIntake = approvedIntake;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.complianceScore = complianceScore;
        this.active = true;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getInstitutionType() { return institutionType; }
    public void setInstitutionType(String institutionType) { this.institutionType = institutionType; }
    public Integer getApprovedIntake() { return approvedIntake; }
    public void setApprovedIntake(Integer approvedIntake) { this.approvedIntake = approvedIntake; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public Integer getComplianceScore() { return complianceScore; }
    public void setComplianceScore(Integer complianceScore) { this.complianceScore = complianceScore; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

