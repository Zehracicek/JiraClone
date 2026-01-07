package com.projecttracker.dto;

public class SprintStatisticsDTO {
    private Long sprintId;
    private String sprintName;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer inProgressTasks;
    private Integer todoTasks;
    private Integer blockedTasks;
    private Integer reviewTasks;
    private Double completionPercentage;
    private Integer remainingDays;
    private Double velocity;

    // Constructors
    public SprintStatisticsDTO() {}

    public SprintStatisticsDTO(Long sprintId, String sprintName) {
        this.sprintId = sprintId;
        this.sprintName = sprintName;
    }

    // Getters and Setters
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

    public Integer getReviewTasks() {
        return reviewTasks;
    }

    public void setReviewTasks(Integer reviewTasks) {
        this.reviewTasks = reviewTasks;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Integer getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(Integer remainingDays) {
        this.remainingDays = remainingDays;
    }

    public Double getVelocity() {
        return velocity;
    }

    public void setVelocity(Double velocity) {
        this.velocity = velocity;
    }
}