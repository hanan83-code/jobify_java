package com.jobify.controller;

import com.jobify.entity.SeekerProfile;
import com.jobify.entity.User;
import com.jobify.repository.SeekerProfileRepository;
import com.jobify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/seeker")
public class SeekerController {

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    public SeekerController(UserRepository userRepository, SeekerProfileRepository seekerProfileRepository) {
        this.userRepository = userRepository;
        this.seekerProfileRepository = seekerProfileRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User me = currentUser();
        if (me == null) return unauthorized();

        SeekerProfile profile = seekerProfileRepository.findByUserId(me.getId())
                .orElseGet(() -> {
                    SeekerProfile p = new SeekerProfile(me);
                    return seekerProfileRepository.save(p);
                });

        return ResponseEntity.ok(toDto(me, profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest req) {
        User me = currentUser();
        if (me == null) return unauthorized();

        // Update user fields
        if (req.fullName() != null && !req.fullName().isBlank()) me.setFullName(req.fullName().trim());
        if (req.phone() != null) me.setPhone(req.phone());
        userRepository.save(me);

        // Update seeker profile
        SeekerProfile profile = seekerProfileRepository.findByUserId(me.getId())
                .orElseGet(() -> new SeekerProfile(me));

        if (req.headline() != null) profile.setHeadline(req.headline());
        if (req.summary() != null) profile.setSummary(req.summary());
        if (req.skills() != null) profile.setSkills(req.skills());
        if (req.education() != null) profile.setEducation(req.education());
        if (req.workHistory() != null) profile.setWorkHistory(req.workHistory());
        if (req.location() != null) profile.setLocation(req.location());
        if (req.linkedinUrl() != null) profile.setLinkedinUrl(req.linkedinUrl());
        if (req.portfolioUrl() != null) profile.setPortfolioUrl(req.portfolioUrl());

        SeekerProfile saved = seekerProfileRepository.save(profile);
        return ResponseEntity.ok(toDto(me, saved));
    }

    @PostMapping("/profile/cv")
    public ResponseEntity<?> uploadCv(@RequestParam("file") MultipartFile file) {
        User me = currentUser();
        if (me == null) return unauthorized();

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            return ResponseEntity.badRequest().body("Invalid file");
        }

        String ext = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf(".")).toLowerCase()
                : "";
        if (!ext.equals(".pdf") && !ext.equals(".doc") && !ext.equals(".docx")) {
            return ResponseEntity.badRequest().body("Only PDF, DOC, DOCX files are allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body("File size must be under 10MB");
        }

        try {
            Path uploadPath = Paths.get(uploadDir, "cv");
            Files.createDirectories(uploadPath);

            String filename = "cv_" + me.getId() + "_" + UUID.randomUUID() + ext;
            Path dest = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/cv/" + filename;

            SeekerProfile profile = seekerProfileRepository.findByUserId(me.getId())
                    .orElseGet(() -> new SeekerProfile(me));
            profile.setCvUrl(fileUrl);
            profile.setCvFilename(originalName);
            seekerProfileRepository.save(profile);

            return ResponseEntity.ok(new CvUploadResponse(fileUrl, originalName));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

    public record UpdateProfileRequest(
            String fullName,
            String phone,
            String headline,
            String summary,
            String skills,
            String education,
            String workHistory,
            String location,
            String linkedinUrl,
            String portfolioUrl) {}

    public record ProfileDto(
            Long userId,
            String fullName,
            String email,
            String phone,
            String headline,
            String summary,
            String cvUrl,
            String cvFilename,
            String skills,
            String education,
            String workHistory,
            String location,
            String linkedinUrl,
            String portfolioUrl) {}

    public record CvUploadResponse(String cvUrl, String cvFilename) {}

    private ProfileDto toDto(User u, SeekerProfile p) {
        return new ProfileDto(
                u.getId(), u.getFullName(), u.getEmail(), u.getPhone(),
                p.getHeadline(), p.getSummary(), p.getCvUrl(), p.getCvFilename(),
                p.getSkills(), p.getEducation(), p.getWorkHistory(),
                p.getLocation(), p.getLinkedinUrl(), p.getPortfolioUrl());
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }
}
