package com.projecttracker.service;

import com.projecttracker.dto.TaskDTO;
import com.projecttracker.dto.UserDTO;
import com.projecttracker.exception.ResourceNotFoundException;
import com.projecttracker.model.Sprint;
import com.projecttracker.model.Task;
import com.projecttracker.model.User;
import com.projecttracker.repository.SprintRepository;
import com.projecttracker.repository.TaskRepository;
import com.projecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPriority(taskDTO.getPriority());
        task.setStatus(taskDTO.getStatus());

        // Set assignee if provided
        if (taskDTO.getAssignee() != null && taskDTO.getAssignee().getId() != null) {
            User assignee = userRepository.findById(taskDTO.getAssignee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", taskDTO.getAssignee().getId()));
            task.setAssignee(assignee);
        }

        // Set sprint if provided
        if (taskDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(taskDTO.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", taskDTO.getSprintId()));
            task.setSprint(sprint);
        }

        Task savedTask = taskRepository.save(task);
        return convertToDTO(savedTask);
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (taskDTO.getTitle() != null) {
            task.setTitle(taskDTO.getTitle());
        }
        if (taskDTO.getDescription() != null) {
            task.setDescription(taskDTO.getDescription());
        }
        if (taskDTO.getPriority() != null) {
            task.setPriority(taskDTO.getPriority());
        }
        if (taskDTO.getStatus() != null) {
            task.setStatus(taskDTO.getStatus());
        }

        if (taskDTO.getAssignee() != null && taskDTO.getAssignee().getId() != null) {
            User assignee = userRepository.findById(taskDTO.getAssignee().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", taskDTO.getAssignee().getId()));
            task.setAssignee(assignee);
        }

        if (taskDTO.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(taskDTO.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", taskDTO.getSprintId()));
            task.setSprint(sprint);
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }


    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        taskRepository.delete(task);
    }

    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return convertToDTO(task);
    }

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByAssignee(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByAssigneeUsername(String username) {
        return taskRepository.findByAssigneeUsername(username).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());

        // Convert assignee
        if (task.getAssignee() != null) {
            UserDTO assigneeDTO = new UserDTO();
            assigneeDTO.setId(task.getAssignee().getId());
            assigneeDTO.setUsername(task.getAssignee().getUsername());
            assigneeDTO.setEmail(task.getAssignee().getEmail());
            assigneeDTO.setFullName(task.getAssignee().getFullName());
            assigneeDTO.setRole(task.getAssignee().getRole());
            assigneeDTO.setAvatarUrl(task.getAssignee().getAvatarUrl());
            dto.setAssignee(assigneeDTO);
        }

        // Convert sprint
        if (task.getSprint() != null) {
            dto.setSprintId(task.getSprint().getId());
            dto.setSprintName(task.getSprint().getName());
        }

        return dto;
    }
}