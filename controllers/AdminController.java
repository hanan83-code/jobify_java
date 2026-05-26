package com.jobify.controller;

import com.jobify.entity.*;
import com.jobify.repository.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final CategoryRepository categoryRepository;

    public AdminController(
            UserRepository userRepository,
            JobRepository jobRepository,
            CompanyRepository companyRepository,
            ApplicationRepository applicationRepository,
            CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/stats")
    public Map<String, Long> stats() {
        return Map.of(
                "users", userRepository.count(),
                "jobSeekers", userRepository.countByRole(User.Role.JOB_SEEKER),
                "employers", userRepository.countByRole(User.Role.EMPLOYER),
                "jobs", jobRepository.count(),
                "activeJobs", jobRepository.countByStatus(Job.Status.ACTIVE),
                "companies", companyRepository.count(),
                "applications", applicationRepository.count(),
                "categories", categoryRepository.count());
    }

    @GetMapping("/users")
    public Page<UserDto> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String role) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = (role == null || role.isBlank())
                ? userRepository.findAll(pageable)
                : userRepository.findByRole(User.Role.valueOf(role.toUpperCase()), pageable);
        return users.map(this::toUserDto);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if (req.isActive() != null) user.setIsActive(req.isActive());
        if (req.role() != null && !req.role().isBlank()) {
            user.setRole(User.Role.valueOf(req.role().toUpperCase()));
        }
        return ResponseEntity.ok(toUserDto(userRepository.save(user)));
    }

    @GetMapping("/jobs")
    public Page<JobSummaryDto> listJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return jobRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toJobSummary);
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<?> updateJobStatus(@PathVariable Long id, @RequestBody StatusRequest req) {
        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) return ResponseEntity.notFound().build();
        job.setStatus(Job.Status.valueOf(req.status().toUpperCase()));
        return ResponseEntity.ok(toJobSummary(jobRepository.save(job)));
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        if (!jobRepository.existsById(id)) return ResponseEntity.notFound().build();
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/applications")
    @Transactional(readOnly = true)
    public Page<ApplicationAdminDto> listApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return applicationRepository.findAll(PageRequest.of(page, size, Sort.by("appliedAt").descending()))
                .map(this::toAppAdminDto);
    }

    @GetMapping("/companies")
    public Page<CompanyAdminDto> listCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return companyRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
                .map(this::toCompanyDto);
    }

    @PatchMapping("/companies/{id}/verify")
    public ResponseEntity<?> verifyCompany(@PathVariable Long id, @RequestBody VerifyRequest req) {
        Company company = companyRepository.findById(id).orElse(null);
        if (company == null) return ResponseEntity.notFound().build();
        company.setIsVerified(req.verified());
        return ResponseEntity.ok(toCompanyDto(companyRepository.save(company)));
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest req) {
        if (req.name() == null || req.name().isBlank()) {
            return ResponseEntity.badRequest().body("Category name required");
        }
        Category cat = new Category(req.name().trim(), req.icon(), 0);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryRepository.save(cat));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        if (!categoryRepository.existsById(id)) return ResponseEntity.notFound().build();
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    public record UpdateUserRequest(Boolean isActive, String role) {}
    public record StatusRequest(String status) {}
    public record VerifyRequest(boolean verified) {}
    public record CategoryRequest(String name, String icon) {}

    public record UserDto(Long id, String fullName, String email, String role, String phone, Boolean isActive, String createdAt) {}
    public record JobSummaryDto(Long id, String title, String companyName, String status, String location, Integer views, String createdAt) {}
    public record ApplicationAdminDto(Long id, String status, String appliedAt, String seekerName, String seekerEmail, String jobTitle, String companyName) {}
    public record CompanyAdminDto(Long id, String companyName, String industry, String location, Boolean isVerified, String ownerEmail) {}

    private UserDto toUserDto(User u) {
        return new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name(), u.getPhone(),
                u.getIsActive(), u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
    }

    private JobSummaryDto toJobSummary(Job j) {
        return new JobSummaryDto(j.getId(), j.getTitle(),
                j.getCompany() != null ? j.getCompany().getCompanyName() : null,
                j.getStatus() != null ? j.getStatus().name() : null,
                j.getLocation(), j.getViews(),
                j.getCreatedAt() != null ? j.getCreatedAt().toString() : null);
    }

    private ApplicationAdminDto toAppAdminDto(Application a) {
        return new ApplicationAdminDto(
                a.getId(),
                a.getStatus() != null ? a.getStatus().name() : null,
                a.getAppliedAt() != null ? a.getAppliedAt().toString() : null,
                a.getSeeker() != null ? a.getSeeker().getFullName() : null,
                a.getSeeker() != null ? a.getSeeker().getEmail() : null,
                a.getJob() != null ? a.getJob().getTitle() : null,
                a.getJob() != null && a.getJob().getCompany() != null ? a.getJob().getCompany().getCompanyName() : null);
    }

    private CompanyAdminDto toCompanyDto(Company c) {
        return new CompanyAdminDto(
                c.getId(), c.getCompanyName(), c.getIndustry(), c.getLocation(),
                c.getIsVerified(),
                c.getUser() != null ? c.getUser().getEmail() : null);
    }
}
