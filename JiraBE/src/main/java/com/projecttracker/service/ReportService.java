package com.projecttracker.service;

import com.projecttracker.dto.ReportDTO;
import com.projecttracker.exception.ResourceNotFoundException;
import com.projecttracker.model.Sprint;
import com.projecttracker.model.Task;
import com.projecttracker.model.TaskStatus;
import com.projecttracker.model.User;
import com.projecttracker.repository.SprintRepository;
import com.projecttracker.repository.TaskRepository;
import com.projecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Map<String, Object>> getAllUsersWorkloadComparison() {
        List<User> users = userRepository.findAll();

        return users.stream().map(user -> {
            Map<String, Object> userStats = new HashMap<>();
            userStats.put("userId", user.getId());
            userStats.put("username", user.getUsername());
            userStats.put("fullName", user.getFullName());

            List<Task> userTasks = taskRepository.findByAssigneeUsername(user.getUsername());
            userStats.put("totalTasks", userTasks.size());
            userStats.put("completedTasks", userTasks.stream().filter(t -> t.getStatus() == TaskStatus.DONE).count());
            userStats.put("inProgressTasks", userTasks.stream().filter(t -> t.getStatus() == TaskStatus.IN_PROGRESS).count());

            return userStats;
        }).collect(Collectors.toList());
    }

}