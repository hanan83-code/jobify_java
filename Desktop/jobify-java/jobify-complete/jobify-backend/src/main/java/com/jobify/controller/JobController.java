package com.jobify.controller;

import com.jobify.entity.Category;
import com.jobify.entity.Company;
import com.jobify.entity.Job;
import com.jobify.entity.JobQuestion;
import com.jobify.entity.User;
import com.jobify.repository.CategoryRepository;
import com.jobify.repository.CompanyRepository;
import com.jobify.repository.JobQuestionRepository;
import com.jobify.repository.JobRepository;
import com.jobify.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobQuestionRepository jobQuestionRepository;

    public JobController(
            JobRepository jobRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            JobQuestionRepository jobQuestionRepository) {
        this.jobRepository = jobRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobQuestionRepository = jobQuestionRepository;
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

        // Save screening questions
        if (req.questions() != null && !req.questions().isEmpty()) {
            int order = 0;
            for (QuestionRequest qr : req.questions()) {
                if (qr.question() != null && !qr.question().isBlank()) {
                    JobQuestion.QuestionType qType = JobQuestion.QuestionType.TEXT;
                    if (qr.questionType() != null) {
                        try { qType = JobQuestion.QuestionType.valueOf(qr.questionType().toUpperCase()); } catch (Exception ignored) {}
                    }
                    jobQuestionRepository.save(new JobQuestion(saved, qr.question(), Boolean.TRUE.equals(qr.isRequired()), qType, order++));
                }
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Long id) {
        if (!jobRepository.existsById(id)) return ResponseEntity.notFound().build();
        List<JobQuestion> questions = jobQuestionRepository.findByJobIdOrderBySortOrderAsc(id);
        return ResponseEntity.ok(questions.stream().map(q -> new QuestionDto(
                q.getId(), q.getQuestion(), q.getIsRequired(), q.getQuestionType().name(), q.getSortOrder()
        )).toList());
    }

    @PutMapping("/{id}/questions")
    @Transactional
    public ResponseEntity<?> updateQuestions(@PathVariable Long id, @RequestBody List<QuestionRequest> questions) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getRole() != User.Role.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Employer role required");
        }

        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();

        Company company = companyRepository.findByUserId(user.getId()).orElse(null);
        if (company == null || !company.getId().equals(job.getCompany().getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not own this job");
        }

        jobQuestionRepository.deleteByJobId(id);

        int order = 0;
        for (QuestionRequest qr : questions) {
            if (qr.question() != null && !qr.question().isBlank()) {
                JobQuestion.QuestionType qType = JobQuestion.QuestionType.TEXT;
                if (qr.questionType() != null) {
                    try { qType = JobQuestion.QuestionType.valueOf(qr.questionType().toUpperCase()); } catch (Exception ignored) {}
                }
                jobQuestionRepository.save(new JobQuestion(job, qr.question(), Boolean.TRUE.equals(qr.isRequired()), qType, order++));
            }
        }

        return ResponseEntity.ok(jobQuestionRepository.findByJobIdOrderBySortOrderAsc(id).stream().map(q -> new QuestionDto(
                q.getId(), q.getQuestion(), q.getIsRequired(), q.getQuestionType().name(), q.getSortOrder()
        )).toList());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();

        if (user.getRole() == User.Role.EMPLOYER) {
            Company company = companyRepository.findByUserId(user.getId()).orElse(null);
            if (company == null || !company.getId().equals(job.getCompany().getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Employer role required");
        }

        try {
            job.setStatus(Job.Status.valueOf(req.status().toUpperCase()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        return ResponseEntity.ok(toDto(jobRepository.save(job)));
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
            Long categoryId,
            List<QuestionRequest> questions) {
    }

    public record QuestionRequest(String question, Boolean isRequired, String questionType) {}

    public record StatusRequest(String status) {}

    public record QuestionDto(Long id, String question, Boolean isRequired, String questionType, Integer sortOrder) {}

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

