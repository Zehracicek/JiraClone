package com.projecttracker.failsafe;

import com.projecttracker.dto.TaskDTO;
import com.projecttracker.model.Task;
import com.projecttracker.model.TaskStatus;
import com.projecttracker.model.User;
import com.projecttracker.repository.TaskRepository;
import com.projecttracker.repository.UserRepository;
import com.projecttracker.service.TaskService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Rollback
class TaskServiceIT {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void getTasksByAssignee_success() {
        // GIVEN
        User user = new User();
        user.setUsername(UUID.randomUUID().toString());
        user.setFullName(UUID.randomUUID().toString());
        user.setEmail(STR."\{UUID.randomUUID()}@gmail.com");
        user.setPassword(passwordEncoder.encode("123456"));
        user = userRepository.save(user);

        Task task = new Task();
        task.setTitle("Test Task");
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setAssignee(user);
        taskRepository.save(task);

        // WHEN
        List<TaskDTO> tasks = taskService.getTasksByAssignee(user.getId());

        // THEN
        assertEquals(1, tasks.size());
        assertEquals("Test Task", tasks.get(0).getTitle());
    }
}
