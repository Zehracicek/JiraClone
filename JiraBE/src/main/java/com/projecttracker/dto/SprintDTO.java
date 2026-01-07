package com.projecttracker.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class SprintDTO {
    private Long id;
    private String name;
    private String goal;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean active;
    private List<TaskDTO> tasks;
    private Integer totalTasks;
    private Integer completedTasks;
    private Double completionPercentage;
    private UserDTO user;

    // Constructors
    public SprintDTO() {
        this.tasks = new ArrayList<>();
    }

    public SprintDTO(Long id, String name, String goal, LocalDate startDate,
                     LocalDate endDate, Boolean active) {
        this.id = id;
        this.name = name;
        this.goal = goal;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
        this.tasks = new ArrayList<>();
    }

    // Helper methods
    public void addTask(TaskDTO task) {
        if (tasks == null) {
            tasks = new ArrayList<>();
        }
        tasks.add(task);
    }

    public void removeTask(TaskDTO task) {
        if (tasks != null) {
            tasks.remove(task);
        }
    }

    public int getTaskCount() {
        return tasks != null ? tasks.size() : 0;
    }

    // Getters and Setters


    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<TaskDTO> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDTO> tasks) {
        this.tasks = tasks;
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

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    @Override
    public String toString() {
        return "SprintDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", goal='" + goal + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", active=" + active +
                ", totalTasks=" + totalTasks +
                ", completedTasks=" + completedTasks +
                ", completionPercentage=" + completionPercentage +
                ", tasksCount=" + (tasks != null ? tasks.size() : 0) +
                '}';
    }
}