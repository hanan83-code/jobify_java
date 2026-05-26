package com.jobify.controller;



import com.jobify.entity.Application;

import com.jobify.entity.Company;

import com.jobify.entity.Job;

import com.jobify.entity.User;

import com.jobify.repository.ApplicationRepository;

import com.jobify.repository.CompanyRepository;

import com.jobify.repository.JobRepository;

import com.jobify.repository.UserRepository;

import jakarta.validation.constraints.NotNull;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;



import java.time.LocalDateTime;



@RestController

@RequestMapping("/api/applications")

public class ApplicationController {



    private final ApplicationRepository applicationRepository;

    private final JobRepository jobRepository;

    private final UserRepository userRepository;

    private final CompanyRepository companyRepository;



    public ApplicationController(

            ApplicationRepository applicationRepository,

            JobRepository jobRepository,

            UserRepository userRepository,

            CompanyRepository companyRepository) {

        this.applicationRepository = applicationRepository;

        this.jobRepository = jobRepository;

        this.userRepository = userRepository;

        this.companyRepository = companyRepository;

    }



    @PostMapping

    public ResponseEntity<?> apply(@RequestBody ApplyRequest req) {

        User me = currentUser();

        if (me == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        if (me.getRole() != User.Role.JOB_SEEKER) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Job seeker role required");



        if (req.seekerId() != null && !req.seekerId().equals(me.getId())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Cannot apply on behalf of another user");

        }



        Long seekerId = me.getId();

        Long jobId = req.jobId();



        if (applicationRepository.existsByJobIdAndSeekerId(jobId, seekerId)) {

            return ResponseEntity.badRequest().body("Already applied to this job");

        }



        Job job = jobRepository.findById(jobId).orElse(null);

        if (job == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");

        if (job.getStatus() != Job.Status.ACTIVE) {

            return ResponseEntity.badRequest().body("This job is no longer accepting applications");

        }



        Application app = new Application(

                job,

                me,

                req.coverLetter(),

                null,

                Application.Status.PENDING);



        Application saved = applicationRepository.save(app);

        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));

    }



    @GetMapping("/seeker/{seekerId}")

    public ResponseEntity<?> getBySeeker(

            @PathVariable Long seekerId,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "10") int size) {

        User me = currentUser();

        if (me == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");

        if (!me.getId().equals(seekerId) && me.getRole() != User.Role.ADMIN) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");

        }



        Page<Application> applications = applicationRepository.findBySeekerId(
                seekerId,
                PageRequest.of(page, size, Sort.by("appliedAt").descending()));
        return ResponseEntity.ok(applications.map(this::toDto));

    }



    @GetMapping("/job/{jobId}")

    public ResponseEntity<?> getByJob(

            @PathVariable Long jobId,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "20") int size) {

        User me = currentUser();

        if (me == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");



        Job job = jobRepository.findById(jobId).orElse(null);

        if (job == null) return ResponseEntity.notFound().build();



        if (me.getRole() != User.Role.ADMIN && !ownsJob(me, job)) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");

        }



        Page<Application> applications = applicationRepository.findByJobId(

                jobId,

                PageRequest.of(page, size, Sort.by("appliedAt").descending()));

        return ResponseEntity.ok(applications.map(this::toEmployerDto));

    }



    @PatchMapping("/{id}/status")

    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusRequest req) {

        User me = currentUser();

        if (me == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");



        Application app = applicationRepository.findById(id).orElse(null);

        if (app == null) return ResponseEntity.notFound().build();



        if (me.getRole() != User.Role.ADMIN && !ownsJob(me, app.getJob())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");

        }



        try {

            app.setStatus(Application.Status.valueOf(req.status().toUpperCase()));

        } catch (Exception e) {

            return ResponseEntity.badRequest().body("Invalid status");

        }



        return ResponseEntity.ok(toEmployerDto(applicationRepository.save(app)));

    }



    public record ApplyRequest(@NotNull Long jobId, Long seekerId, String coverLetter) {}

    public record StatusRequest(String status) {}



    public record ApplicationDto(

            Long id,

            String status,

            LocalDateTime appliedAt,

            JobMini job) {}



    public record EmployerApplicationDto(

            Long id,

            String status,

            LocalDateTime appliedAt,

            String coverLetter,

            SeekerMini seeker,

            JobMini job) {}



    public record JobMini(Long id, String title, String companyName) {}

    public record SeekerMini(Long id, String fullName, String email, String phone) {}



    private ApplicationDto toDto(Application a) {

        return new ApplicationDto(

                a.getId(),

                a.getStatus() != null ? a.getStatus().name() : null,

                a.getAppliedAt(),

                a.getJob() != null

                        ? new JobMini(

                                a.getJob().getId(),

                                a.getJob().getTitle(),

                                a.getJob().getCompany() != null ? a.getJob().getCompany().getCompanyName() : null)

                        : null);

    }



    private EmployerApplicationDto toEmployerDto(Application a) {

        return new EmployerApplicationDto(

                a.getId(),

                a.getStatus() != null ? a.getStatus().name() : null,

                a.getAppliedAt(),

                a.getCoverLetter(),

                a.getSeeker() != null

                        ? new SeekerMini(

                                a.getSeeker().getId(),

                                a.getSeeker().getFullName(),

                                a.getSeeker().getEmail(),

                                a.getSeeker().getPhone())

                        : null,

                a.getJob() != null

                        ? new JobMini(

                                a.getJob().getId(),

                                a.getJob().getTitle(),

                                a.getJob().getCompany() != null ? a.getJob().getCompany().getCompanyName() : null)

                        : null);

    }



    private User currentUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) return null;

        return userRepository.findByEmail(auth.getName()).orElse(null);

    }



    private boolean ownsJob(User user, Job job) {

        if (user.getRole() != User.Role.EMPLOYER || job == null || job.getCompany() == null) return false;

        Company company = companyRepository.findByUserId(user.getId()).orElse(null);

        return company != null && company.getId().equals(job.getCompany().getId());

    }

}


