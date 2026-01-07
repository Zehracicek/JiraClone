package com.projecttracker.surefire;

import com.projecttracker.dto.SprintDTO;
import com.projecttracker.dto.TaskDTO;
import com.projecttracker.dto.UserDTO;
import com.projecttracker.model.*;
import com.projecttracker.repository.SprintRepository;
import com.projecttracker.repository.TaskRepository;
import com.projecttracker.repository.UserRepository;
import com.projecttracker.service.SprintService;
import com.projecttracker.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SprintServiceTest {

    @Mock
    private SprintRepository sprintRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private SprintService sprintService;

    private User user;
    private Sprint sprint;
    private Task task;
    private UserDTO userDTO;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("onur");
        user.setFullName("Onur Aran");

        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setUsername("onur");
        userDTO.setFullName("Onur Aran");

        sprint = new Sprint();
        sprint.setId(10L);
        sprint.setName("Sprint 1");
        sprint.setStartDate(LocalDate.now());
        sprint.setEndDate(LocalDate.now().plusDays(14));
        sprint.setActive(true);
        sprint.setUsers(user);

        task = new Task();
        task.setId(100L);
        task.setTitle("Test Task");
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setAssignee(user);


    }

    @Test
    void createSprint_success() {
        SprintDTO dto = new SprintDTO();
        dto.setName("Sprint 1");
        dto.setUser(userDTO);
        dto.setStartDate(LocalDate.now());
        dto.setEndDate(LocalDate.now().plusDays(10));
        dto.setActive(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sprintRepository.findByActive(true)).thenReturn(List.of());
        when(sprintRepository.save(any(Sprint.class))).thenReturn(sprint);

        SprintDTO result = sprintService.createSprint(dto);

        assertNotNull(result);
        assertEquals("Sprint 1", result.getName());
        verify(sprintRepository).save(any(Sprint.class));
    }

    @Test
    void getSprintById_success() {
        when(sprintRepository.findById(10L))
                .thenReturn(Optional.of(sprint));

        SprintDTO result = sprintService.getSprintById(10L);

        assertEquals("Sprint 1", result.getName());
    }

    @Test
    void getActiveSprint_success() {
        task.setSprint(sprint);
        sprint.setTasks(List.of(task));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(sprintRepository.findActiveSprintByUser(user))
                .thenReturn(Optional.of(sprint));
        when(userService.getUserById(1L)).thenReturn(userDTO);

        SprintDTO result = sprintService.getActiveSprint(1L);

        assertTrue(result.getActive());
        assertEquals(1, result.getTasks().size());
    }

    @Test
    void getTasksInSprint_success() {
        when(sprintRepository.findById(10L))
                .thenReturn(Optional.of(sprint));
        when(taskRepository.findBySprintId(10L))
                .thenReturn(List.of(task));
        when(userService.getUserById(1L)).thenReturn(userDTO);

        List<TaskDTO> tasks = sprintService.getTasksInSprint(10L);

        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getTitle());
    }

    @Test
    void addTaskToSprint_success() {
        when(sprintRepository.findById(10L))
                .thenReturn(Optional.of(sprint));
        when(taskRepository.findById(100L))
                .thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class)))
                .thenReturn(task);
        when(userService.getUserById(1L)).thenReturn(userDTO);

        TaskDTO dto = sprintService.addTaskToSprint(10L, 100L);

        assertEquals("Test Task", dto.getTitle());
        verify(taskRepository).save(task);
    }
}
