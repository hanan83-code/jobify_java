package com.jobify.controller;

import com.jobify.entity.*;
import com.jobify.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/employer")
public class EmployerController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

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
                .map(c -> ResponseEntity.ok(toFullCompanyDto(c)))
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
        if (req.size() != null && !req.size().isBlank()) {
            try { company.setSize(Company.CompanySize.valueOf(req.size().toUpperCase())); } catch (Exception ignored) {}
        }
        if (req.foundedYear() != null) company.setFoundedYear(req.foundedYear());

        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(toFullCompanyDto(saved));
    }

    @PostMapping("/company/logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        User employer = currentEmployer();
        if (employer == null) return unauthorized();

        Company company = companyRepository.findByUserId(employer.getId()).orElse(null);
        if (company == null) return ResponseEntity.badRequest().body("Company not found");

        String originalName = file.getOriginalFilename();
        if (originalName == null) return ResponseEntity.badRequest().body("Invalid file");

        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf(".")).toLowerCase()
                : "";
        if (!ext.equals(".jpg") && !ext.equals(".jpeg") && !ext.equals(".png") && !ext.equals(".webp")) {
            return ResponseEntity.badRequest().body("Only JPG, PNG, WEBP files are allowed");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size must be under 5MB");
        }

        try {
            Path uploadPath = Paths.get(uploadDir, "logos");
            Files.createDirectories(uploadPath);
            String filename = "logo_" + company.getId() + "_" + UUID.randomUUID() + ext;
            Path dest = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            String logoUrl = "/uploads/logos/" + filename;
            company.setLogoUrl(logoUrl);
            companyRepository.save(company);
            return ResponseEntity.ok(Map.of("logoUrl", logoUrl));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    public record JobWithAppsDto(Long id, String title, String status, String location, Integer views, long applicationCount, String createdAt) {}
    public record CompanyDto(Long id, String companyName, String industry, String website, String description, String location, Boolean isVerified) {}
    public record FullCompanyDto(Long id, String companyName, String industry, String website, String logoUrl, String description, String location, String size, Integer foundedYear, Boolean isVerified) {}
    public record UpdateCompanyRequest(String companyName, String industry, String website, String description, String location, String size, Integer foundedYear) {}

    private FullCompanyDto toFullCompanyDto(Company c) {
        return new FullCompanyDto(c.getId(), c.getCompanyName(), c.getIndustry(), c.getWebsite(),
                c.getLogoUrl(), c.getDescription(), c.getLocation(),
                c.getSize() != null ? c.getSize().name() : null, c.getFoundedYear(), c.getIsVerified());
    }

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
