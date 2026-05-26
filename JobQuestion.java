package com.jobify.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "job_questions")
public class JobQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "is_required", nullable = false)
    private Boolean isRequired = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType = QuestionType.TEXT;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    public JobQuestion() {}

    public JobQuestion(Job job, String question, Boolean isRequired, QuestionType questionType, Integer sortOrder) {
        this.job = job;
        this.question = question;
        this.isRequired = isRequired;
        this.questionType = questionType;
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public Boolean getIsRequired() { return isRequired; }
    public void setIsRequired(Boolean isRequired) { this.isRequired = isRequired; }

    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }

    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }

    public enum QuestionType {
        TEXT, YES_NO, MULTIPLE_CHOICE
    }
}
