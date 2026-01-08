package com.projecttracker.service;

import com.projecttracker.model.Attachment;
import com.projecttracker.repository.AttachmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    public Attachment create(Attachment attachment) {
        attachment.setUploadedAt(LocalDateTime.now());
        return attachmentRepository.save(attachment);
    }
}
