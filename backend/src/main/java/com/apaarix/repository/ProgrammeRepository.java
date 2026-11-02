package com.apaarix.repository;

import com.apaarix.entity.Programme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgrammeRepository extends JpaRepository<Programme, Long> {
    List<Programme> findByInstitutionId(Long institutionId);
}

