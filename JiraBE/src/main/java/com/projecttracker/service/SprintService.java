package com.projecttracker.service;

import com.projecttracker.dto.SprintDTO;
import com.projecttracker.dto.TaskDTO;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    public SprintDTO createSprint(SprintDTO sprintDTO) {
        if (sprintDTO.getStartDate() == null || sprintDTO.getEndDate() == null) {
            throw new IllegalArgumentException("Start date and end date are required");
        }

        if (sprintDTO.getStartDate().isAfter(sprintDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        if (sprintDTO.getName() == null || sprintDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Sprint name is required");
        }

        if (sprintDTO.getActive() != null && sprintDTO.getActive()) {
            deactivateAllSprints();
        }

        Sprint sprint = new Sprint();
        sprint.setId(sprintDTO.getId());
        sprint.setName(sprintDTO.getName().trim());
        sprint.setGoal(sprintDTO.getGoal());
        sprint.setStartDate(sprintDTO.getStartDate());
        sprint.setEndDate(sprintDTO.getEndDate());
        sprint.setUsers(userRepository.findById(sprintDTO.getUser().getId()).get());
        sprint.setActive(sprintDTO.getActive() != null ? sprintDTO.getActive() : false);

        Sprint savedSprint = sprintRepository.save(sprint);
        return convertToDTO(savedSprint);
    }

    public SprintDTO updateSprint(Long id, SprintDTO sprintDTO) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", id));

        if (sprintDTO.getName() != null && !sprintDTO.getName().trim().isEmpty()) {
            sprint.setName(sprintDTO.getName().trim());
        }

        if (sprintDTO.getGoal() != null) {
            sprint.setGoal(sprintDTO.getGoal());
        }

        if (sprintDTO.getStartDate() != null && sprintDTO.getEndDate() != null) {
            if (sprintDTO.getStartDate().isAfter(sprintDTO.getEndDate())) {
                throw new IllegalArgumentException("Start date cannot be after end date");
            }
            sprint.setStartDate(sprintDTO.getStartDate());
            sprint.setEndDate(sprintDTO.getEndDate());
        } else if (sprintDTO.getStartDate() != null) {
            if (sprintDTO.getStartDate().isAfter(sprint.getEndDate())) {
                throw new IllegalArgumentException("Start date cannot be after end date");
            }
            sprint.setStartDate(sprintDTO.getStartDate());
        } else if (sprintDTO.getEndDate() != null) {
            if (sprint.getStartDate().isAfter(sprintDTO.getEndDate())) {
                throw new IllegalArgumentException("Start date cannot be after end date");
            }
            sprint.setEndDate(sprintDTO.getEndDate());
        }

        if (sprintDTO.getActive() != null) {
            if (sprintDTO.getActive() && !sprint.getActive()) {
                deactivateAllSprints();
            }
            sprint.setActive(sprintDTO.getActive());
        }

        Sprint updatedSprint = sprintRepository.save(sprint);
        return convertToDTO(updatedSprint);
    }

    public void deleteSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", id));

        List<Task> tasks = taskRepository.findBySprintId(id);
        for (Task task : tasks) {
            task.setSprint(null);
        }
        taskRepository.saveAll(tasks);

        sprintRepository.delete(sprint);
    }

    public SprintDTO getSprintById(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", id));
        return convertToDTO(sprint);
    }

    public List<SprintDTO> getAllSprints() {
        return sprintRepository.findAllByOrderByStartDateDesc().stream()
                .map(this::convertToDTOWithStatistics)
                .collect(Collectors.toList());
    }

    public SprintDTO getActiveSprint(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Sprint sprint = sprintRepository.findActiveSprintByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("No active sprint found"));
        List<Task> filteredTasks = sprint.getTasks().stream()
                .filter(t -> t.getAssignee().getId().equals(userId))
                .toList();
        sprint.setTasks(filteredTasks);
        return convertToDTO(sprint);
    }

    public TaskDTO addTaskToSprint(Long sprintId, Long taskId) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", sprintId));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        task.setSprint(sprint);
        Task updatedTask = taskRepository.save(task);

        return convertTaskToDTO(updatedTask);
    }

    public TaskDTO removeTaskFromSprint(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));

        task.setSprint(null);
        Task updatedTask = taskRepository.save(task);

        return convertTaskToDTO(updatedTask);
    }

    public List<TaskDTO> getTasksInSprint(Long sprintId) {
        sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", sprintId));

        return taskRepository.findBySprintId(sprintId).stream()
                .map(this::convertTaskToDTO)
                .collect(Collectors.toList());
    }

    private void deactivateAllSprints() {
        List<Sprint> activeSprints = sprintRepository.findByActive(true);
        for (Sprint sprint : activeSprints) {
            sprint.setActive(false);
        }
        sprintRepository.saveAll(activeSprints);
    }

    private SprintDTO convertToDTO(Sprint sprint) {
        SprintDTO dto = new SprintDTO();
        dto.setId(sprint.getId());
        dto.setName(sprint.getName());
        dto.setGoal(sprint.getGoal());
        dto.setStartDate(sprint.getStartDate());
        dto.setEndDate(sprint.getEndDate());
        dto.setActive(sprint.getActive());

        if (sprint.getTasks() != null && !sprint.getTasks().isEmpty()) {
            List<TaskDTO> taskDTOs = sprint.getTasks().stream()
                    .map(this::convertTaskToDTO)
                    .collect(Collectors.toList());
            dto.setTasks(taskDTOs);
        }

        return dto;
    }

    private SprintDTO convertToDTOWithStatistics(Sprint sprint) {
        SprintDTO dto = new SprintDTO();
        dto.setId(sprint.getId());
        dto.setName(sprint.getName());
        dto.setGoal(sprint.getGoal());
        dto.setStartDate(sprint.getStartDate());
        dto.setEndDate(sprint.getEndDate());
        dto.setActive(sprint.getActive());

        List<Task> tasks = taskRepository.findBySprintId(sprint.getId());

        dto.setTotalTasks(tasks.size());

        long completedCount = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE || task.getStatus() == TaskStatus.COMPLETED)
                .count();
        dto.setCompletedTasks((int) completedCount);

        if (tasks.isEmpty()) {
            dto.setCompletionPercentage(0.0);
        } else {
            double percentage = (completedCount * 100.0) / tasks.size();
            dto.setCompletionPercentage(Math.round(percentage * 100.0) / 100.0);
        }
        dto.setTasks(tasks.stream().map(this::convertTaskToDTO).collect(Collectors.toList()));

        return dto;
    }

    private TaskDTO convertTaskToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPriority(task.getPriority());
        dto.setStatus(task.getStatus());
        dto.setAssignee(userService.getUserById(task.getAssignee().getId()));
        if (task.getSprint() != null) {
            dto.setSprintId(task.getSprint().getId());
        }
        return dto;
    }

    public static class SprintStatistics {
        private Long sprintId;
        private String sprintName;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer inProgressTasks;
        private Integer todoTasks;
        private Integer blockedTasks;
        private Double completionPercentage;

        public Long getSprintId() {
            return sprintId;
        }

        public void setSprintId(Long sprintId) {
            this.sprintId = sprintId;
        }

        public String getSprintName() {
            return sprintName;
        }

        public void setSprintName(String sprintName) {
            this.sprintName = sprintName;
        }

        public Integer getTotalTasks() {
            return totalTasks;
        }

        public void setTotalTasks(Integer totalTasks) {
            this.totalTasks = totalTasks;
        }

        public Integer getCompletedTasks() {
            return completedTasks;
        }

        public void setCompletedTasks(Integer completedTasks) {
            this.completedTasks = completedTasks;
        }

        public Integer getInProgressTasks() {
            return inProgressTasks;
        }

        public void setInProgressTasks(Integer inProgressTasks) {
            this.inProgressTasks = inProgressTasks;
        }

        public Integer getTodoTasks() {
            return todoTasks;
        }

        public void setTodoTasks(Integer todoTasks) {
            this.todoTasks = todoTasks;
        }

        public Integer getBlockedTasks() {
            return blockedTasks;
        }

        public void setBlockedTasks(Integer blockedTasks) {
            this.blockedTasks = blockedTasks;
        }

        public Double getCompletionPercentage() {
            return completionPercentage;
        }

        public void setCompletionPercentage(Double completionPercentage) {
            this.completionPercentage = completionPercentage;
        }
    }
}