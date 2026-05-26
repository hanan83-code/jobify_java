package com.jobify.repository;

import com.jobify.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("""
            SELECT j FROM Job j
            WHERE j.status = 'ACTIVE'
              AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%',:keyword,'%'))
                   OR LOWER(j.description) LIKE LOWER(CONCAT('%',:keyword,'%')))
              AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%',:location,'%')))
              AND (:categoryId IS NULL OR j.category.id = :categoryId)
              AND (:jobType IS NULL OR j.jobType = :jobType)
            """)
    Page<Job> search(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("categoryId") Long categoryId,
            @Param("jobType") Job.JobType jobType,
            Pageable pageable);

    Page<Job> findByCompanyIdAndStatus(Long companyId, Job.Status status, Pageable pageable);

    Page<Job> findByCompanyId(Long companyId, Pageable pageable);

    long countByStatus(Job.Status status);

    long countByCompanyId(Long companyId);

    long countByCompanyIdAndStatus(Long companyId, Job.Status status);
}
