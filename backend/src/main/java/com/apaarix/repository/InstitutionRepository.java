package com.apaarix.repository;

import com.apaarix.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    Optional<Institution> findByCode(String code);
    List<Institution> findAllByOrderByApprovedIntakeDesc();
    List<Institution> findByStateIgnoreCase(String state);
}

