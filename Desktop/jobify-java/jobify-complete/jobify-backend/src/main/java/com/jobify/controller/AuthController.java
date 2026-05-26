package com.jobify.controller;

import com.jobify.entity.Company;
import com.jobify.entity.User;
import com.jobify.repository.CompanyRepository;
import com.jobify.repository.UserRepository;
import com.jobify.security.JwtUtils;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        User.Role role;
        try {
            role = User.Role.valueOf(req.role().toUpperCase());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid role. Use JOB_SEEKER or EMPLOYER.");
        }

        User user = new User(
                req.fullName(),
                req.email(),
                passwordEncoder.encode(req.password()),
                req.phone(),
                role,
                null,
                true);
        user = userRepository.save(user);

        Company company = null;
        if (role == User.Role.EMPLOYER) {
            String companyName = (req.companyName() == null || req.companyName().isBlank())
                    ? (user.getFullName() + " Company")
                    : req.companyName().trim();
            company = companyRepository.save(new Company(
                    user,
                    companyName,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    true));
        }

        String token = jwtUtils.generateToken(user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, toDto(user, company)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        return userRepository.findByEmail(req.email())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .filter(u -> Boolean.TRUE.equals(u.getIsActive()))
                .map(u -> {
                    Company company = companyRepository.findByUserId(u.getId()).orElse(null);
                    String token = jwtUtils.generateToken(u.getEmail());
                    return ResponseEntity.ok((Object) new AuthResponse(token, toDto(u, company)));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password"));
    }

    public record RegisterRequest(
            @NotBlank String fullName,
            @Email @NotBlank String email,
            @NotBlank @Size(min = 6) String password,
            String phone,
            @NotBlank String role,
            String companyName) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password) {
    }

    public record UserDto(Long id, String fullName, String email, String role, Long companyId, String companyName) {
    }

    public record AuthResponse(String token, UserDto user) {
    }

    private UserDto toDto(User u, Company company) {
        return new UserDto(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getRole().name(),
                company != null ? company.getId() : null,
                company != null ? company.getCompanyName() : null);
    }
}

