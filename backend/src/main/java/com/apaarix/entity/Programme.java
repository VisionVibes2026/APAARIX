package com.apaarix.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "programmes")
public class Programme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "degree_level", nullable = false, length = 20)
    private String degreeLevel; // UG, PG

    @Column(name = "approved_intake", nullable = false)
    private Integer approvedIntake;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    public Programme() {}

    public Programme(String code, String name, String degreeLevel, Integer approvedIntake, Institution institution) {
        this.code = code;
        this.name = name;
        this.degreeLevel = degreeLevel;
        this.approvedIntake = approvedIntake;
        this.institution = institution;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDegreeLevel() { return degreeLevel; }
    public void setDegreeLevel(String degreeLevel) { this.degreeLevel = degreeLevel; }
    public Integer getApprovedIntake() { return approvedIntake; }
    public void setApprovedIntake(Integer approvedIntake) { this.approvedIntake = approvedIntake; }
    public Institution getInstitution() { return institution; }
    public void setInstitution(Institution institution) { this.institution = institution; }
}

