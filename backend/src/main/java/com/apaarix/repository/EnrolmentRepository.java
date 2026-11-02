package com.apaarix.repository;

import com.apaarix.entity.Enrolment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrolmentRepository extends JpaRepository<Enrolment, Long> {
    List<Enrolment> findByStudentId(Long studentId);
    List<Enrolment> findByInstitutionId(Long institutionId);
    List<Enrolment> findByAcademicYear(String academicYear);
    long countByInstitutionId(Long institutionId);
    long countByProgrammeId(Long programmeId);
}

