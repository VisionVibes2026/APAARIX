package com.apaarix.repository;

import com.apaarix.entity.ComplianceViolation;
import com.apaarix.enums.ViolationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplianceViolationRepository extends JpaRepository<ComplianceViolation, Long> {
    List<ComplianceViolation> findByStatus(ViolationStatus status);
    List<ComplianceViolation> findByInstitutionId(Long institutionId);
    long countByStatus(ViolationStatus status);
}

