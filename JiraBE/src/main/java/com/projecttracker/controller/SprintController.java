package com.projecttracker.controller;

import com.projecttracker.dto.SprintDTO;
import com.projecttracker.dto.TaskDTO;
import com.projecttracker.service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
public class SprintController {

    @Autowired
    private SprintService sprintService;

    /**
     * Create a new sprint
     * POST /api/sprints
     */
    @PostMapping
    public ResponseEntity<SprintDTO> createSprint(@RequestBody SprintDTO sprintDTO) {
        SprintDTO created = sprintService.createSprint(sprintDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Update sprint
     * PUT /api/sprints/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<SprintDTO> updateSprint(
            @PathVariable Long id,
            @RequestBody SprintDTO sprintDTO) {
        SprintDTO updated = sprintService.updateSprint(id, sprintDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete sprint
     * DELETE /api/sprints/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get sprint by ID
     * GET /api/sprints/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<SprintDTO> getSprintById(@PathVariable Long id) {
        SprintDTO sprint = sprintService.getSprintById(id);
        return ResponseEntity.ok(sprint);
    }

    /**
     * Get all sprints
     * GET /api/sprints
     */
    @GetMapping
    public ResponseEntity<List<SprintDTO>> getAllSprints() {
        List<SprintDTO> sprints = sprintService.getAllSprints();
        return ResponseEntity.ok(sprints);
    }

    /**
     * Get active sprint
     * GET /api/sprints/active
     */
    @GetMapping("/active/{userId}")
    public ResponseEntity<SprintDTO> getActiveSprint(@PathVariable Long userId) {
        SprintDTO sprint = sprintService.getActiveSprint(userId);
        return ResponseEntity.ok(sprint);
    }

    /**
     * Add task to sprint
     * POST /api/sprints/{sprintId}/tasks/{taskId}
     */
    @PostMapping("/{sprintId}/tasks/{taskId}")
    public ResponseEntity<TaskDTO> addTaskToSprint(
            @PathVariable Long sprintId,
            @PathVariable Long taskId) {
        TaskDTO task = sprintService.addTaskToSprint(sprintId, taskId);
        return ResponseEntity.ok(task);
    }

    /**
     * Remove task from sprint
     * DELETE /api/sprints/tasks/{taskId}
     */
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> removeTaskFromSprint(@PathVariable Long taskId) {
        TaskDTO task = sprintService.removeTaskFromSprint(taskId);
        return ResponseEntity.ok(task);
    }

    /**
     * Get tasks in sprint
     * GET /api/sprints/{sprintId}/tasks
     */
    @GetMapping("/{sprintId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasksInSprint(@PathVariable Long sprintId) {
        List<TaskDTO> tasks = sprintService.getTasksInSprint(sprintId);
        return ResponseEntity.ok(tasks);
    }
}
