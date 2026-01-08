package com.projecttracker.repository;

import com.projecttracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findBySprintId(Long sprintId);

    @Query("SELECT t FROM Task t WHERE t.assignee.id = :assigneeId")
    List<Task> findByAssigneeId(@Param("assigneeId") Long assigneeId);

    @Query("SELECT t FROM Task t WHERE t.assignee.username = :username")
    List<Task> findByAssigneeUsername(@Param("username") String username);

    @Query("SELECT t FROM Task t WHERE t.assignee IS NULL")
    List<Task> findUnassignedTasks();

    Optional<Task> findByTitle(String title);
}