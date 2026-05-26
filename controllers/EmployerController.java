package com.jobify.controller;

import com.jobify.entity.*;
import com.jobify.repository.*;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public EmployerController(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        User employer = currentEmployer();
        if (employer == null) return unauthorized();

        Company company = companyRepository.findByUserId(employer.getId()).orElse(null);
        if (company == null) return ResponseEntity.badRequest().body("Company profile not found");

        long jobCount = jobRepository.countByCompanyId(company.getId());
        long activeJobs = jobRepository.countByCompanyIdAndStatus(company.getId(), Job.Status.ACTIVE);
        long totalApplications = applicationRepository.countByJobCompanyId(company.getId());

        return ResponseEntity.ok(Map.of(
                "jobs", jobCount,
                "activeJobs", activeJobs,
                "applications", totalApplications,
                "companyName", company.getCompanyName()));
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> myJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User employer = currentEmployer();
        if (employer == null) return unauthorized();

        Company company = companyRepository.findByUserId(employer.getId()).orElse(null);
        if (company == null) return ResponseEntity.badRequest().body("Company profile not found");

        Page<Job> jobs = jobRepository.findByCompanyId(
                company.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return ResponseEntity.ok(jobs.map(j -> new JobWithAppsDto(
                j.getId(),
                j.getTitle(),
                j.getStatus() != null ? j.getStatus().name() : null,
                j.getLocation(),
                j.getViews(),
                applicationRepository.countByJobId(j.getId()),
                j.getCreatedAt() != null ? j.getCreatedAt().toString() : null)));
    }

    @GetMapping("/company")
    public ResponseEntity<?> myCompany() {
        User employer = currentEmployer();
        if (employer == null) return unauthorized();

        return companyRepository.findByUserId(employer.getId())
                .map(c -> ResponseEntity.ok(new CompanyDto(
                        c.getId(), c.getCompanyName(), c.getIndustry(), c.getWebsite(),
                        c.getDescription(), c.getLocation(), c.getIsVerified())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/company")
    public ResponseEntity<?> updateCompany(@RequestBody UpdateCompanyRequest req) {
        User employer = currentEmployer();
        if (employer == null) return unauthorized();

        Company company = companyRepository.findByUserId(employer.getId()).orElse(null);
        if (company == null) return ResponseEntity.notFound().build();

        if (req.companyName() != null && !req.companyName().isBlank()) company.setCompanyName(req.companyName().trim());
        if (req.industry() != null) company.setIndustry(req.industry());
        if (req.website() != null) company.setWebsite(req.website());
        if (req.description() != null) company.setDescription(req.description());
        if (req.location() != null) company.setLocation(req.location());

        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(new CompanyDto(
                saved.getId(), saved.getCompanyName(), saved.getIndustry(), saved.getWebsite(),
                saved.getDescription(), saved.getLocation(), saved.getIsVerified()));
    }

    public record JobWithAppsDto(Long id, String title, String status, String location, Integer views, long applicationCount, String createdAt) {}
    public record CompanyDto(Long id, String companyName, String industry, String website, String description, String location, Boolean isVerified) {}
    public record UpdateCompanyRequest(String companyName, String industry, String website, String description, String location) {}

    private User currentEmployer() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        User user = userRepository.findByEmail(auth.getName()).orElse(null);
        if (user == null || user.getRole() != User.Role.EMPLOYER) return null;
        return user;
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }
}
