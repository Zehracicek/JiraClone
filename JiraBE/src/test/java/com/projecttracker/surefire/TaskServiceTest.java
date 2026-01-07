package com.projecttracker.surefire;

import com.projecttracker.dto.TaskDTO;
import com.projecttracker.model.Task;
import com.projecttracker.model.User;
import com.projecttracker.repository.TaskRepository;
import com.projecttracker.repository.UserRepository;
import com.projecttracker.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User user;
    private Task task;
    private TaskDTO taskDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("onur");

        task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setAssignee(user);

        taskDTO = new TaskDTO();
        taskDTO.setTitle("Test Task");
    }

    @Test
    void testCreateTask_Success() {
        when(taskRepository.save(any(Task.class)))
                .thenReturn(task);

        TaskDTO result = taskService.createTask(taskDTO);

        assertNotNull(result);
    }

    @Test
    void testGetTaskById_Success() {
        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        TaskDTO result = taskService.getTaskById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void testUpdateTask_Success() {
        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class)))
                .thenReturn(task);

        TaskDTO result = taskService.updateTask(1L, taskDTO);

        assertNotNull(result);
    }

    @Test
    void testDeleteTask_Success() {
        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        taskService.deleteTask(1L);

        verify(taskRepository).delete(task);
    }

    @Test
    void testGetTasksByAssignee() {
        User user = new User();
        user.setId(2L);

        Task task = new Task();
        task.setAssignee(user);

        when(taskRepository.findByAssigneeId(2L))
                .thenReturn(List.of(task));

        List<TaskDTO> result = taskService.getTasksByAssignee(2L);

        assertEquals(1, result.size());
    }

}
