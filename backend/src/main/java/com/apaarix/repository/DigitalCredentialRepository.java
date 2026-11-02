package com.apaarix.repository;

import com.apaarix.entity.DigitalCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DigitalCredentialRepository extends JpaRepository<DigitalCredential, Long> {
    Optional<DigitalCredential> findByCredentialId(String credentialId);
    Optional<DigitalCredential> findByStudentId(Long studentId);
}

