package com.projecttracker.service;

import com.projecttracker.model.Label;
import com.projecttracker.repository.LabelRepository;
import org.springframework.stereotype.Service;

@Service
public class LabelService {

    private final LabelRepository labelRepository;

    public LabelService(LabelRepository labelRepository) {
        this.labelRepository = labelRepository;
    }

    public Label create(Label label) {
        return labelRepository.save(label);
    }
}

