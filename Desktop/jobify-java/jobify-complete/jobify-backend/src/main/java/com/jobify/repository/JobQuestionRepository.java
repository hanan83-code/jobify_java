package com.jobify.repository;

import com.jobify.entity.JobQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobQuestionRepository extends JpaRepository<JobQuestion, Long> {
    List<JobQuestion> findByJobIdOrderBySortOrderAsc(Long jobId);
    void deleteByJobId(Long jobId);
}
