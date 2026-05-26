package com.jobify.controller;

import com.jobify.entity.Company;
import com.jobify.repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @GetMapping
    public List<CompanyDto> list() {
        return companyRepository.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> get(@PathVariable Long id) {
        return companyRepository.findById(id).map(c -> ResponseEntity.ok(toDto(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    public record CompanyDto(
            Long id,
            String companyName,
            String industry,
            String website,
            String logoUrl,
            String description,
            String location,
            Boolean isVerified) {
    }

    private CompanyDto toDto(Company c) {
        return new CompanyDto(
                c.getId(),
                c.getCompanyName(),
                c.getIndustry(),
                c.getWebsite(),
                c.getLogoUrl(),
                c.getDescription(),
                c.getLocation(),
                c.getIsVerified());
    }
}

