package com.jobify.controller;

import com.jobify.entity.Category;
import com.jobify.entity.Company;
import com.jobify.entity.Job;
import com.jobify.entity.User;
import com.jobify.repository.CategoryRepository;
import com.jobify.repository.CompanyRepository;
import com.jobify.repository.JobRepository;
import com.jobify.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    public JobController(
            JobRepository jobRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
    }

    @GetMapping
    public ResponseEntity<Page<JobDto>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String jobType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Job.JobType type = null;
        if (jobType != null && !jobType.isBlank()) {
            type = Job.JobType.valueOf(jobType.toUpperCase());
        }

        Page<Job> jobs = jobRepository.search(
                emptyToNull(keyword),
                emptyToNull(location),
                categoryId,
                type,
                pageable);
        return ResponseEntity.ok(jobs.map(this::toDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJob(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(j -> {
                    j.setViews(j.getViews() + 1);
                    jobRepository.save(j);
                    return ResponseEntity.ok(toDto(j));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@Valid @RequestBody CreateJobRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        if (user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Employer role required");
        }

        Company company = companyRepository.findByUserId(user.getId()).orElse(null);
        if (company == null) {
            return ResponseEntity.badRequest().body("Employer company profile missing. Re-register as EMPLOYER.");
        }

        Category category = null;
        if (req.categoryId() != null) {
            category = categoryRepository.findById(req.categoryId()).orElse(null);
        }

        Job job = new Job(
                company,
                category,
                req.title(),
                req.description(),
                req.requirements(),
                req.responsibilities(),
                Job.JobType.valueOf(req.jobType().toUpperCase()),
                req.location(),
                Optional.ofNullable(req.isRemote()).orElse(false),
                req.salaryMin(),
                req.salaryMax(),
                (req.salaryCurrency() == null || req.salaryCurrency().isBlank()) ? "ETB" : req.salaryCurrency(),
                req.experienceYears(),
                req.educationLevel() != null && !req.educationLevel().isBlank()
                        ? Job.EducationLevel.valueOf(req.educationLevel().toUpperCase())
                        : null,
                req.deadline(),
                Job.Status.ACTIVE,
                0);

        Job saved = jobRepository.save(job);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    public record CreateJobRequest(
            @NotBlank String title,
            @NotBlank String description,
            String requirements,
            String responsibilities,
            String location,
            @NotBlank String jobType,
            Boolean isRemote,
            BigDecimal salaryMin,
            BigDecimal salaryMax,
            String salaryCurrency,
            Integer experienceYears,
            String educationLevel,
            LocalDate deadline,
            Long categoryId) {
    }

    public record JobDto(
            Long id,
            String title,
            String description,
            String requirements,
            String responsibilities,
            String location,
            String jobType,
            Boolean isRemote,
            BigDecimal salaryMin,
            BigDecimal salaryMax,
            String salaryCurrency,
            Integer experienceYears,
            String educationLevel,
            LocalDate deadline,
            String status,
            Integer views,
            String createdAt,
            String companyName,
            String companyLogo,
            String categoryName) {
    }

    private JobDto toDto(Job j) {
        return new JobDto(
                j.getId(),
                j.getTitle(),
                j.getDescription(),
                j.getRequirements(),
                j.getResponsibilities(),
                j.getLocation(),
                j.getJobType() != null ? j.getJobType().name() : null,
                j.getIsRemote(),
                j.getSalaryMin(),
                j.getSalaryMax(),
                j.getSalaryCurrency(),
                j.getExperienceYears(),
                j.getEducationLevel() != null ? j.getEducationLevel().name() : null,
                j.getDeadline(),
                j.getStatus() != null ? j.getStatus().name() : null,
                j.getViews(),
                j.getCreatedAt() != null ? j.getCreatedAt().toString() : null,
                j.getCompany() != null ? j.getCompany().getCompanyName() : null,
                j.getCompany() != null ? j.getCompany().getLogoUrl() : null,
                j.getCategory() != null ? j.getCategory().getName() : null);
    }

    private static String emptyToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}

