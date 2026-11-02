package com.apaarix.repository;

import com.apaarix.entity.ApaarVerification;
import com.apaarix.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApaarVerificationRepository extends JpaRepository<ApaarVerification, Long> {
    Optional<ApaarVerification> findByStudentId(Long studentId);
    Optional<ApaarVerification> findByApaarId(String apaarId);
    List<ApaarVerification> findByStatus(VerificationStatus status);
    long countByStatus(VerificationStatus status);
}

