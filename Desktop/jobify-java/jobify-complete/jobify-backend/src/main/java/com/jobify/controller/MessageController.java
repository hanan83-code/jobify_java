package com.jobify.controller;

import com.jobify.entity.Application;
import com.jobify.entity.Message;
import com.jobify.entity.User;
import com.jobify.repository.ApplicationRepository;
import com.jobify.repository.MessageRepository;
import com.jobify.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public MessageController(MessageRepository messageRepository,
                             UserRepository userRepository,
                             ApplicationRepository applicationRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    /** Send a message to another user (optionally linked to an application) */
    @PostMapping
    public ResponseEntity<?> send(@RequestBody SendMessageRequest req) {
        User me = currentUser();
        if (me == null) return unauthorized();

        User recipient = userRepository.findById(req.recipientId()).orElse(null);
        if (recipient == null) return ResponseEntity.badRequest().body("Recipient not found");
        if (recipient.getId().equals(me.getId())) return ResponseEntity.badRequest().body("Cannot message yourself");

        Application application = null;
        if (req.applicationId() != null) {
            application = applicationRepository.findById(req.applicationId()).orElse(null);
        }

        Message msg = new Message(me, recipient, application, req.content());
        Message saved = messageRepository.save(msg);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    /** Get conversation between current user and another user */
    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<?> getConversation(@PathVariable Long otherUserId) {
        User me = currentUser();
        if (me == null) return unauthorized();

        List<Message> messages = messageRepository.findConversation(me.getId(), otherUserId);

        // Mark received messages as read
        messages.stream()
                .filter(m -> m.getRecipient().getId().equals(me.getId()) && !m.getIsRead())
                .forEach(m -> {
                    m.setIsRead(true);
                    messageRepository.save(m);
                });

        return ResponseEntity.ok(messages.stream().map(this::toDto).toList());
    }

    /** Get all messages for a specific application thread */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<?> getApplicationThread(@PathVariable Long applicationId) {
        User me = currentUser();
        if (me == null) return unauthorized();

        Application app = applicationRepository.findById(applicationId).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        // Only the seeker or the employer who owns the job can view
        boolean isSeeker = app.getSeeker().getId().equals(me.getId());
        boolean isEmployer = app.getJob().getCompany().getUser().getId().equals(me.getId());
        if (!isSeeker && !isEmployer) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Forbidden");
        }

        List<Message> messages = messageRepository.findByApplicationIdOrderBySentAtAsc(applicationId);

        // Mark received messages as read
        messages.stream()
                .filter(m -> m.getRecipient().getId().equals(me.getId()) && !m.getIsRead())
                .forEach(m -> {
                    m.setIsRead(true);
                    messageRepository.save(m);
                });

        return ResponseEntity.ok(messages.stream().map(this::toDto).toList());
    }

    /** Get inbox (latest message per conversation) */
    @GetMapping("/inbox")
    public ResponseEntity<?> inbox(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User me = currentUser();
        if (me == null) return unauthorized();

        Page<Message> inbox = messageRepository.findInbox(
                me.getId(),
                PageRequest.of(page, size, Sort.by("sentAt").descending()));

        return ResponseEntity.ok(inbox.map(this::toInboxDto));
    }

    /** Count unread messages */
    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount() {
        User me = currentUser();
        if (me == null) return unauthorized();
        long count = messageRepository.countByRecipientIdAndIsReadFalse(me.getId());
        return ResponseEntity.ok(java.util.Map.of("unread", count));
    }

    public record SendMessageRequest(@jakarta.validation.constraints.NotNull Long recipientId, Long applicationId, @NotBlank String content) {}

    public record MessageDto(
            Long id,
            Long senderId,
            String senderName,
            Long recipientId,
            String recipientName,
            Long applicationId,
            String content,
            Boolean isRead,
            LocalDateTime sentAt) {}

    public record InboxMessageDto(
            Long id,
            Long otherUserId,
            String otherUserName,
            String otherUserRole,
            Long applicationId,
            String content,
            Boolean isRead,
            LocalDateTime sentAt) {}

    private MessageDto toDto(Message m) {
        return new MessageDto(
                m.getId(),
                m.getSender().getId(),
                m.getSender().getFullName(),
                m.getRecipient().getId(),
                m.getRecipient().getFullName(),
                m.getApplication() != null ? m.getApplication().getId() : null,
                m.getContent(),
                m.getIsRead(),
                m.getSentAt());
    }

    private InboxMessageDto toInboxDto(Message m) {
        User me = currentUser();
        boolean isSender = me != null && m.getSender().getId().equals(me.getId());
        User other = isSender ? m.getRecipient() : m.getSender();
        return new InboxMessageDto(
                m.getId(),
                other.getId(),
                other.getFullName(),
                other.getRole().name(),
                m.getApplication() != null ? m.getApplication().getId() : null,
                m.getContent(),
                m.getIsRead(),
                m.getSentAt());
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
