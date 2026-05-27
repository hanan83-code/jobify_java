package com.jobify;

import com.jobify.entity.Category;
import com.jobify.entity.Company;
import com.jobify.entity.Job;
import com.jobify.entity.User;
import com.jobify.repository.CategoryRepository;
import com.jobify.repository.CompanyRepository;
import com.jobify.repository.JobRepository;
import com.jobify.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoryRepository.count() == 0) {
                categoryRepository.saveAll(List.of(
                        new Category("Information Technology", "💻", 0),
                        new Category("Finance & Accounting", "📊", 0),
                        new Category("Engineering", "⚙️", 0),
                        new Category("Health & Medicine", "🏥", 0),
                        new Category("Education & Training", "🎓", 0),
                        new Category("Sales & Marketing", "📢", 0),
                        new Category("Human Resources", "👥", 0),
                        new Category("Legal", "⚖️", 0),
                        new Category("NGO & Development", "🌍", 0),
                        new Category("Logistics & Transport", "🚚", 0),
                        new Category("Construction", "🏗️", 0),
                        new Category("Hospitality & Tourism", "🏨", 0)));
            }

            User employer = userRepository.findByEmail("employer@jobify.dev").orElseGet(() -> userRepository.save(new User(
                    "TechCorp HR",
                    "employer@jobify.dev",
                    passwordEncoder.encode("Password123!"),
                    "+251911000111",
                    User.Role.EMPLOYER,
                    null,
                    true)));

            Company company = companyRepository.findByUserId(employer.getId()).orElseGet(() -> companyRepository.save(new Company(
                    employer,
                    "TechCorp Ethiopia",
                    "Information Technology",
                    "https://techcorp.example",
                    null,
                    "A product-focused engineering team building modern web experiences.",
                    "Addis Ababa",
                    null,
                    2016,
                    true)));

            User seeker = userRepository.findByEmail("seeker@jobify.dev").orElseGet(() -> userRepository.save(new User(
                    "Abebe Kebede",
                    "seeker@jobify.dev",
                    passwordEncoder.encode("Password123!"),
                    "+251922000222",
                    User.Role.JOB_SEEKER,
                    null,
                    true)));

            List<Category> categories = categoryRepository.findAll();
            Category fallbackCategory = categories.stream()
                    .filter(c -> "Information Technology".equals(c.getName()))
                    .findFirst()
                    .orElse(categories.isEmpty() ? null : categories.get(0));

            long targetJobCount = 20;
            long currentJobCount = jobRepository.count();
            if (currentJobCount < targetJobCount && fallbackCategory != null) {
                long jobsToCreate = targetJobCount - currentJobCount;
                List<Job> jobs = new ArrayList<>();
                String[] titles = {
                        "Senior React Engineer",
                        "Java Spring Boot Developer",
                        "Frontend Developer",
                        "Backend API Engineer",
                        "DevOps Engineer",
                        "QA Automation Engineer",
                        "UI/UX Designer",
                        "Data Analyst",
                        "Product Manager",
                        "Mobile App Developer"
                };

                String[] locations = { "Addis Ababa", "Adama", "Hawassa", "Bahir Dar", "Remote" };

                for (int i = 0; i < jobsToCreate; i++) {
                    int idx = (int) ((currentJobCount + i) % titles.length);
                    int locIdx = (int) ((currentJobCount + i) % locations.length);
                    Category category = categories.isEmpty() ? fallbackCategory
                            : categories.get((int) ((currentJobCount + i) % categories.size()));
                    int years = (int) ((currentJobCount + i) % 5) + 1;

                    jobs.add(new Job(
                            company,
                            category,
                            titles[idx],
                            "Join our team to build impactful products and deliver high-quality solutions for employers and job seekers.",
                            "Strong communication, problem solving, and relevant technical skills.",
                            "Collaborate with cross-functional teams, deliver features, and improve platform quality.",
                            Job.JobType.FULL_TIME,
                            locations[locIdx],
                            "Remote".equals(locations[locIdx]),
                            new BigDecimal("60000").add(BigDecimal.valueOf(idx * 5000L)),
                            new BigDecimal("90000").add(BigDecimal.valueOf(idx * 7000L)),
                            "ETB",
                            years,
                            Job.EducationLevel.BACHELOR,
                            LocalDate.now().plusDays(20 + i),
                            Job.Status.ACTIVE,
                            0));
                }
                jobRepository.saveAll(jobs);
            }

            // keep seeded accounts referenced
            System.out.println("DataSeeder: seeded employer id=" + employer.getId() + ", seeker id=" + seeker.getId());
        };
    }
}

