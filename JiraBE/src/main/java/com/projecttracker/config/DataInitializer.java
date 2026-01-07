package com.projecttracker.config;

import com.projecttracker.model.*;
import com.projecttracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // ---------- USERS ----------
        User admin = userRepository.findByUsername("admin")
                .orElseGet(() -> {
                    User u = new User();
                    u.setUsername("admin");
                    u.setEmail("admin@mail.com");
                    u.setFullName("Admin User");
                    u.setRole(Role.ADMIN);
                    u.setPassword(passwordEncoder.encode("123456"));
                    return userRepository.save(u);
                });

        User dev1 = userRepository.findByUsername("robotuser")
                .orElseGet(() -> {
                    User u = new User();
                    u.setUsername("robotuser");
                    u.setEmail("robotuser@mail.com");
                    u.setFullName("robotuser");
                    u.setRole(Role.DEVELOPER);
                    u.setPassword(passwordEncoder.encode("test123456"));
                    return userRepository.save(u);
                });

        User dev2 = userRepository.findByUsername("ayse")
                .orElseGet(() -> {
                    User u = new User();
                    u.setUsername("ayse");
                    u.setEmail("ayse@mail.com");
                    u.setFullName("Ayşe Yılmaz");
                    u.setRole(Role.DEVELOPER);
                    u.setPassword(passwordEncoder.encode("123456"));
                    return userRepository.save(u);
                });

        // ---------- SPRINTS ----------
        Sprint sprint1 = sprintRepository.existsByUsers(dev1)
                ? sprintRepository.findByUserId(dev1.getId()).get(0)
                : createSprint("Sprint 1", "Authentication ve temel task yönetimi", LocalDate.now().minusDays(7),
                LocalDate.now().plusDays(7), true, dev1);

        Sprint sprint2 = sprintRepository.existsByUsers(dev2)
                ? sprintRepository.findByUserId(dev2.getId()).get(0)
                : createSprint("Sprint 2", "Frontend geliştirme ve UI iyileştirmeleri", LocalDate.now(),
                LocalDate.now().plusDays(14), true, dev2);

        // ---------- TASKS ----------
        Task task1 = createOrGetTask("Login API", dev1, sprint1, Priority.HIGH, TaskStatus.IN_PROGRESS, "JWT tabanlı login endpointi");
        Task task2 = createOrGetTask("Task CRUD", dev2, sprint2, Priority.MEDIUM, TaskStatus.TODO, "Task create / update / delete işlemleri");
        Task task3 = createOrGetTask("Swagger Config", dev1, sprint1, Priority.LOW, TaskStatus.DONE, "Swagger UI ayarları");
        Task task4 = createOrGetTask("Frontend Styling", dev2, sprint2, Priority.MEDIUM, TaskStatus.IN_PROGRESS, "UI iyileştirmeleri ve responsive tasarım");

        sprint1.setTasks(List.of(task1, task3));
        sprint2.setTasks(List.of(task2, task4));
        sprintRepository.saveAll(List.of(sprint1, sprint2));

        System.out.println("✅ Mock data başarıyla yüklendi.");
    }

    private Task createOrGetTask(String title, User assignee, Sprint sprint, Priority priority, TaskStatus status, String description) {
        return taskRepository.findByTitle(title)
                .orElseGet(() -> {
                    Task t = new Task();
                    t.setTitle(title);
                    t.setDescription(description);
                    t.setPriority(priority);
                    t.setStatus(status);
                    t.setAssignee(assignee);
                    t.setSprint(sprint);
                    return taskRepository.save(t);
                });
    }


    private Sprint createSprint(String name, String goal, LocalDate startDate, LocalDate endDate, boolean active, User user) {
        Sprint sprint = new Sprint();
        sprint.setName(name);
        sprint.setGoal(goal);
        sprint.setStartDate(startDate);
        sprint.setEndDate(endDate);
        sprint.setActive(active);
        sprint.addUser(user);
        sprint.setTasks(new ArrayList<>());
        return sprintRepository.save(sprint);
    }
}
