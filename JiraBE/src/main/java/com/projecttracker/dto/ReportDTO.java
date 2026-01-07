package com.projecttracker.dto;

import java.util.Map;

public class ReportDTO {

    // Sprint Burndown Report
    public static class BurndownReport {
        private Long sprintId;
        private String sprintName;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer remainingTasks;
        private Map<String, Integer> dailyProgress;

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

        public Integer getRemainingTasks() {
            return remainingTasks;
        }

        public void setRemainingTasks(Integer remainingTasks) {
            this.remainingTasks = remainingTasks;
        }

        public Map<String, Integer> getDailyProgress() {
            return dailyProgress;
        }

        public void setDailyProgress(Map<String, Integer> dailyProgress) {
            this.dailyProgress = dailyProgress;
        }
    }

    // User Workload Report
    public static class UserWorkloadReport {
        private String username;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer inProgressTasks;
        private Double totalHoursSpent;

        // Getters and Setters
        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
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

        public Double getTotalHoursSpent() {
            return totalHoursSpent;
        }

        public void setTotalHoursSpent(Double totalHoursSpent) {
            this.totalHoursSpent = totalHoursSpent;
        }
    }
}