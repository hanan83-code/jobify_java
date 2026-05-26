package com.jobify.repository;

import com.jobify.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findBySeekerId(Long seekerId, Pageable pageable);

    Page<Application> findByJobId(Long jobId, Pageable pageable);

    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);

    long countByJobId(Long jobId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.company.id = :companyId")
    long countByJobCompanyId(@Param("companyId") Long companyId);
}
