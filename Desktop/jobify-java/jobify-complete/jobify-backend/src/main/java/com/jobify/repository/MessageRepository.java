package com.jobify.repository;

import com.jobify.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // All messages in a conversation between two users (optionally scoped to an application)
    @Query("""
            SELECT m FROM Message m
            WHERE ((m.sender.id = :userId1 AND m.recipient.id = :userId2)
                OR (m.sender.id = :userId2 AND m.recipient.id = :userId1))
            ORDER BY m.sentAt ASC
            """)
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

    // All messages for a specific application thread
    List<Message> findByApplicationIdOrderBySentAtAsc(Long applicationId);

    // Inbox: latest message per conversation partner for a user
    @Query(value = """
            SELECT * FROM messages m
            WHERE m.id IN (
                SELECT MAX(m2.id) FROM messages m2
                WHERE m2.recipient_id = :userId OR m2.sender_id = :userId
                GROUP BY LEAST(m2.sender_id, m2.recipient_id), GREATEST(m2.sender_id, m2.recipient_id)
            )
            ORDER BY m.sent_at DESC
            """, nativeQuery = true)
    Page<Message> findInbox(@Param("userId") Long userId, Pageable pageable);

    long countByRecipientIdAndIsReadFalse(Long recipientId);

    List<Message> findByApplicationIdAndRecipientIdAndIsReadFalse(Long applicationId, Long recipientId);
}
