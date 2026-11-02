package com.apaarix.repository;

import com.apaarix.entity.DuplicateAlert;
import com.apaarix.enums.DuplicateReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DuplicateAlertRepository extends JpaRepository<DuplicateAlert, Long> {
    List<DuplicateAlert> findByReviewStatus(DuplicateReviewStatus reviewStatus);
    long countByReviewStatus(DuplicateReviewStatus reviewStatus);
}

