package com.projecttracker.controller;

import com.projecttracker.model.Attachment;
import com.projecttracker.service.AttachmentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping
    public Attachment create(@RequestBody Attachment attachment) {
        return attachmentService.create(attachment);
    }
}

