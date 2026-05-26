package com.jobify.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "application_answers")
public class ApplicationAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private JobQuestion question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    public ApplicationAnswer() {}

    public ApplicationAnswer(Application application, JobQuestion question, String answer) {
        this.application = application;
        this.question = question;
        this.answer = answer;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public JobQuestion getQuestion() { return question; }
    public void setQuestion(JobQuestion question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
