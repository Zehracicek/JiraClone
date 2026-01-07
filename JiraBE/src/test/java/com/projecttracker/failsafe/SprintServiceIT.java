package com.projecttracker.failsafe;

import com.projecttracker.dto.SprintDTO;
import com.projecttracker.dto.UserDTO;
import com.projecttracker.model.User;
import com.projecttracker.repository.SprintRepository;
import com.projecttracker.repository.UserRepository;
import com.projecttracker.service.SprintService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@Rollback
class SprintServiceIT {

    @Autowired
    private SprintService sprintService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void createSprint_success_integration() {
        // GIVEN
        User user = new User();
        user.setUsername(UUID.randomUUID().toString());
        user.setFullName(UUID.randomUUID().toString());
        user.setEmail(STR."\{UUID.randomUUID()}@gmail.com");
        user.setPassword(passwordEncoder.encode("123456"));
        user = userRepository.save(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());

        SprintDTO dto = new SprintDTO();
        dto.setName("Sprint 1");
        dto.setStartDate(LocalDate.now());
        dto.setEndDate(LocalDate.now().plusDays(10));
        dto.setActive(true);
        dto.setUser(userDTO);
        dto.setGoal("Goal");


        // WHEN
        SprintDTO result = sprintService.createSprint(dto);


        // THEN
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Sprint 1", result.getName());
    }
}
