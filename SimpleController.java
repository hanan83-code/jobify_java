package com.jobify.controller;

import com.jobify.repository.CategoryRepository;
import com.jobify.repository.JobRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SimpleController {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;

    public SimpleController(JobRepository jobRepository, CategoryRepository categoryRepository) {
        this.jobRepository = jobRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/status")
    public String getStatus() {
        long activeJobs = jobRepository.countByStatus(com.jobify.entity.Job.Status.ACTIVE);
        long categories = categoryRepository.count();
        return "Jobify Backend is running. activeJobs=" + activeJobs + ", categories=" + categories;
    }
}
